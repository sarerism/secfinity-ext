import React, { useState } from 'react';
import { Button, Input, Typography, message, Divider, Select, Space, Card, theme } from 'antd';
import { CopyOutlined, createFromIconfontCN, ClearOutlined } from '@ant-design/icons';
import Clipboard from 'react-clipboard.js';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const IconFont = createFromIconfontCN({
    scriptUrl: ['./iconfont.js']
});

export default function Encoder() {
    const { token } = theme.useToken();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('base64');

    const handleModeChange = (value: string) => {
        setMode(value);
        setInput('');
        setOutput('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const process = (action: 'encode' | 'decode') => {
        let result = '';
        try {
            switch (mode) {
                case 'base64':
                    result = action === 'encode' ? btoa(input) : atob(input);
                    break;
                case 'url':
                    result = action === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
                    break;
                case 'html':
                    result = action === 'encode' ? htmlEncode(input) : htmlDecode(input);
                    break;
                case 'unicode':
                    result = action === 'encode' ? unicodeEncode(input) : unicodeDecode(input);
                    break;
                case 'hex':
                    result = action === 'encode' ? toHex(input) : fromHex(input);
                    break;
                case 'rot13':
                    result = rot13(input);
                    break;
                case 'binary':
                    result = action === 'encode' ? toBinary(input) : fromBinary(input);
                    break;
                case 'ascii':
                    result = action === 'encode' ? toAscii(input) : fromAscii(input);
                    break;
                default:
                    break;
            }
            setOutput(result);
        } catch (error) {
            message.error('Conversion failed. Please check your input.');
            console.error(error);
        }
    };

    // Helper functions
    const htmlEncode = (str: string) => {
        return str.replace(/[\u00A0-\u9999<>\&"']/g, function(i) {
            return '&#'+i.charCodeAt(0)+';';
        });
    };

    const htmlDecode = (str: string) => {
        const doc = new DOMParser().parseFromString(str, "text/html");
        return doc.documentElement.textContent || "";
    };

    const unicodeEncode = (str: string) => {
        return str.split('').map(char => {
            const hex = char.charCodeAt(0).toString(16).toUpperCase();
            return '\\u' + '0000'.substring(0, 4 - hex.length) + hex;
        }).join('');
    };

    const unicodeDecode = (str: string) => {
        return str.replace(/\\u[\dA-F]{4}/gi, (match) => {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    };

    const toHex = (str: string) => {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += str.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return result.toUpperCase();
    };

    const fromHex = (str: string) => {
        const hex = str.toString().replace(/\s/g, '');
        let result = '';
        for (let i = 0; i < hex.length; i += 2) {
            result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return result;
    };

    const rot13 = (str: string) => {
        return str.replace(/[a-zA-Z]/g, function (c: any) {
            return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
    };

    const toBinary = (str: string) => {
        return str.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(' ');
    };

    const fromBinary = (str: string) => {
        return str.split(' ').map(bin => {
            return String.fromCharCode(parseInt(bin, 2));
        }).join('');
    };
    
    const toAscii = (str: string) => {
        return str.split('').map(char => char.charCodeAt(0)).join(' ');
    }

    const fromAscii = (str: string) => {
        return str.split(' ').map(code => String.fromCharCode(parseInt(code))).join('');
    }

    return (
        <div>
            <Title level={2}>
                <IconFont type='icon-jiemaleixing' style={{ marginRight: 8 }} />
                Encoder
            </Title>
            <Paragraph type="secondary">
                Encoding and decoding utilities for various formats
            </Paragraph>
            
            <Divider dashed />

            <Space direction="vertical" style={{ width: '100%' }}>
                <Card title="Select Encoding Format" size="small">
                    <Select defaultValue="base64" style={{ width: '100%' }} onChange={handleModeChange}>
                        <Option value="base64">Base64</Option>
                        <Option value="url">URL Encoding</Option>
                        <Option value="html">HTML Entity</Option>
                        <Option value="unicode">Unicode Escape</Option>
                        <Option value="hex">Hexadecimal</Option>
                        <Option value="rot13">ROT13</Option>
                        <Option value="binary">Binary</Option>
                        <Option value="ascii">ASCII (Decimal)</Option>
                    </Select>
                </Card>

                <TextArea
                    rows={5}
                    value={input}
                    onChange={handleChange}
                    placeholder={`Enter text to ${mode === 'rot13' ? 'rotate' : 'encode/decode'}...`}
                    style={{ fontFamily: 'monospace' }}
                />

                <Space wrap>
                    <Button type="primary" onClick={() => process('encode')}>
                        {mode === 'rot13' ? 'Apply ROT13' : 'Encode'}
                    </Button>
                    {mode !== 'rot13' && (
                        <Button onClick={() => process('decode')}>
                            Decode
                        </Button>
                    )}
                    <Button type="dashed" onClick={() => setInput('')} icon={<ClearOutlined />}>
                        Clear Input
                    </Button>
                </Space>

                <TextArea
                    rows={5}
                    value={output}
                    placeholder="Result will appear here..."
                    readOnly
                    style={{ fontFamily: 'monospace', backgroundColor: token.colorFillAlter, color: token.colorText }}
                />
                
                <Space>
                    <Clipboard component="a" data-clipboard-text={output}>
                        <Button icon={<CopyOutlined />}>Copy Result</Button>
                    </Clipboard>
                    <Button type="dashed" onClick={() => setOutput('')} icon={<ClearOutlined />}>
                        Clear Output
                    </Button>
                </Space>
            </Space>
        </div>
    );
}
