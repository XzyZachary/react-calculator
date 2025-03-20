/**
 * Calculator Component
 * 一个功能完整的计算器组件，支持基本的数学运算
 * 包含数字输入、运算符操作、清除功能等
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import style from './style.module.scss';
import { Button, Input } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { evaluate } from 'mathjs';

/**
 * 组件属性接口定义
 * @interface IProps
 * @property {Function} ESCClick - 可选，ESC按钮点击处理函数
 * @property {Function} onOk - 可选，确认按钮点击处理函数
 * @property {string | number} value - 可选，计算器的初始值
 */
interface IProps {
  ESCClick?: () => void;
  onOk?: (value: string) => void;
  value?: string | number;
}

const Calculator: React.FC<IProps> = ({ ESCClick, onOk, value }) => {
  // 状态定义
  const [fullText, setFullText] = useState<string>(''); // 当前输入的完整表达式
  const [resultText, setResultText] = useState<string>(''); // 计算结果
  const [isResultClicked, setIsResultClicked] = useState<boolean>(false); // 是否点击了等号
  const [isResultInvalid, setIsResultInvalid] = useState<boolean>(false); // 计算结果是否有效

  /**
   * 处理数字按钮点击
   * @param digit 点击的数字
   */
  const digitClick = useCallback(
    (digit: string) => {
      if (isResultClicked) {
        setFullText(digit);
        setIsResultClicked(false);
      } else {
        let _fullText: string = fullText;
        // If fullText is 0, then clear it
        if (_fullText === '0.' || _fullText === '00.') {
          // fullText = "";
        } else if (parseFloat(fullText) === 0) {
          _fullText = '';
        }
        _fullText = _fullText + digit;
        setFullText(_fullText);
      }
    },
    [isResultClicked, fullText]
  );

  /**
   * 监听value属性变化，更新计算器显示值
   */
  useEffect(() => {
    if (value) {
      setFullText(value?.toString());
    }
  }, [value]);

  /**
   * 处理运算符按钮点击
   * @param operationSign 运算符号
   */
  const operationClick = useCallback(
    (operationSign: string) => {
      if (resultText.length > 0) {
        setFullText(resultText + operationSign);
        setIsResultClicked(false);
        setFullText('');
      } else {
        setFullText((prev) => prev + operationSign);
      }
    },
    [resultText]
  );

  /**
   * 处理小数点按钮点击
   * 如果已经显示结果，则重新开始新的输入
   */
  const dotClick = () => {
    if (isResultClicked) {
      setFullText('0.');
      setResultText('');
      setIsResultClicked(false);
    } else {
      setFullText((prev) => prev + '.');
    }
  };

  /**
   * 处理功能按钮点击（AC清除所有、C删除一位、正负号切换）
   * @param key 功能键类型
   */
  const functionalButtonClick = useCallback(
    (key: 'AC' | 'C' | '+-') => {
      switch (key) {
        case 'AC':
          setFullText('');
          setResultText('');
          break;
        case 'C':
          setResultText('');
          if (fullText.length > 0) {
            let newFullText = fullText.slice(0, -1);
            setFullText(newFullText);
            setIsResultClicked(false);
          }
          break;
        case '+-':
          try {
            let fullTextNew = '-(' + fullText + ')';
            setFullText(fullTextNew);
            setResultText('');
          } catch (error) {
            setFullText('');
            setResultText('');
          }
          break;

        default:
          break;
      }
    },
    [fullText]
  );

  /**
   * 计算当前表达式的结果
   * 使用useMemo优化性能，只在fullText变化时重新计算
   */
  const _result = useMemo(() => {
    try {
      if (!fullText) return '';
      let _fullText = fullText;
      // const regex = new RegExp(/[+\-\/\*\(\.\÷]$/);
      // 在项目中运用build后会被编译成/[+\-\/\*\(\.\\xf7]$/， 会导致输入数字7被截断
      // const regex = new RegExp(/[+\-\/\*\(\.\u00F7]$/);
      const regex = new RegExp(/[+\-/*(.\u00F7]$/);
      while (regex.test(_fullText)) {
        _fullText = _fullText?.replace(regex, '');
      }
      const result = evaluate(_fullText?.replaceAll('÷', '/'));
      setIsResultInvalid(false);
      return typeof result === 'number' ? result.toString() : String(result);
    } catch (error) {
      console.log('error', error);
      setIsResultInvalid(true);
      return '错误';
    }
  }, [fullText]);

  /**
   * 处理等号按钮点击，计算最终结果
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const equalClick = useCallback(() => {
    try {
      let finalResult = parseCalculate(fullText);
      setResultText(finalResult.toString());
      setIsResultClicked(false);
      setIsResultInvalid(false);
    } catch (error) {
      console.log('error', error);
      let resultText = 'invalid';
      setResultText(resultText);
      setIsResultClicked(false);
      setIsResultInvalid(true);
    }
  }, [fullText]);

  /**
   * 解析并计算表达式
   * @param fullText 要计算的表达式字符串
   * @returns 计算结果
   */
  const parseCalculate = (fullText: string): number => {
    const result = evaluate(fullText);
    return typeof result === 'string' ? parseFloat(result) : result;
  };

  /**
   * 根据显示内容长度返回合适的CSS类名
   * 实现响应式字体大小调整
   */
  const printResultTextCSS = (): string => {
    const totalLength = fullText.length + resultText.length;
    const baseClass = style.resultArea;
    
    if (totalLength <= 18) {
      return `${baseClass} ${style['resultArea-md']}`;
    } else if (totalLength <= 35) {
      return `${baseClass} ${style['resultArea-sm']}`;
    } else if (totalLength <= 55) {
      return `${baseClass} ${style['resultArea-xsm']}`;
    } else {
      return `${baseClass} ${style['resultArea-xxsm']}`;
    }
  };

  /**
   * 处理ESC按钮点击
   */
  const escClick = useCallback(() => {
    if (ESCClick) {
      ESCClick();
    }
  }, [ESCClick]);

  return (
    <div>
      <div className={style.calculatorHeader}>
        <div className={style.calculatorArea}>
          <div className={printResultTextCSS()}>
            <Input
              value={fullText}
              className={style.borderNone}
              onChange={(e) => {
                setFullText(e.target.value.replaceAll('/', '÷').trim());
              }}
            ></Input>
          </div>
          <div className={style.result}>
            {isResultInvalid && _result && <span className={style.textDanger}>{' = ' + _result}</span>}

            {!isResultInvalid && _result && <span className={style.textSuccess}>{' = ' + _result}</span>}
          </div>
        </div>
      </div>

      <div className={style.CalBtns}>
        <div>
          <Button className={`${style.ACBtn} ${style.iconBtn}`} onClick={() => functionalButtonClick('AC')}>
            AC
          </Button>

          <Button className={`${style.signBtn} ${style.iconBtn}`} onClick={() => operationClick('(')}>
            (
          </Button>
          <Button className={`${style.signBtn} ${style.iconBtn}`} onClick={() => operationClick(')')}>
            )
          </Button>
          <Button className={`${style.signBtn} ${style.iconBtn}`} onClick={() => operationClick('÷')}>
            ÷
          </Button>
          <Button
            className={`${style.ACBtn} ${style.iconBtn}`}
            onClick={() => functionalButtonClick('C')}
            icon={<ArrowLeftOutlined />}
          ></Button>
        </div>

        <div>
          <Button className={`${style.iconBtn}`} onClick={() => digitClick('7')}>
            7
          </Button>
          <Button className={`${style.iconBtn}`} onClick={() => digitClick('8')}>
            8
          </Button>
          <Button className={`${style.iconBtn}`} onClick={() => digitClick('9')}>
            9
          </Button>
          <Button className={`${style.signBtn} ${style.iconBtn}`} onClick={() => operationClick('*')}>
            ×
          </Button>
          <Button className={`${style.signBtn} ${style.iconBtn}`} onClick={() => functionalButtonClick('+-')}>
            +/-
          </Button>
        </div>

        <div>
          <Button className={`${style.iconBtn}`} onClick={() => digitClick('4')}>
            4
          </Button>
          <Button className={`${style.iconBtn}`} onClick={() => digitClick('5')}>
            5
          </Button>
          <Button className={`${style.iconBtn}`} onClick={() => digitClick('6')}>
            6
          </Button>
          <Button className={`${style.signBtn} ${style.iconBtn}`} onClick={() => operationClick('-')}>
            -
          </Button>
          <Button className={`${style.signBtn} ${style.iconBtn}`} onClick={() => operationClick('%')}>
            %
          </Button>
        </div>

        <div>
          <Button className={`${style.iconBtn}`} onClick={() => digitClick('1')}>
            1
          </Button>
          <Button className={`${style.iconBtn}`} onClick={() => digitClick('2')}>
            2
          </Button>
          <Button className={`${style.iconBtn}`} onClick={() => digitClick('3')}>
            3
          </Button>
          <Button className={`${style.signBtn} ${style.iconBtn}`} onClick={() => operationClick('+')}>
            +
          </Button>
          <Button className={`${style.ACBtn} ${style.iconBtn}`} onClick={() => escClick()}>
            ESC
          </Button>
        </div>

        <div className={`${style.lastBtn}`}>
          <Button className={`${style.iconBtn}`} onClick={() => digitClick('00')}>
            00
          </Button>
          <Button className={`${style.iconBtn}`} onClick={() => digitClick('0')}>
            0
          </Button>
          <Button className={`${style.iconBtn}`} onClick={() => dotClick()}>
            .
          </Button>
          <Button className={`${style.equal}`} onClick={() => onOk?.(_result)}>
            <span>
              <div className={style.equalText}>
                <span>=</span>
                <span>(Enter)</span>
              </div>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
