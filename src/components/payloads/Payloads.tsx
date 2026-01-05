import React, { useState } from 'react';
import { Typography, Card, Select, List, Button, message, Tooltip, theme } from 'antd';
import { createFromIconfontCN, CopyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import webPayloads from '../../assets/data/WebPayloads.json';

interface PayloadItem {
    title?: string;
    subtitle?: string;
    content: string;
}

interface PayloadSection {
    title: string;
    items: PayloadItem[];
}

interface PayloadCategory {
    name: string;
    value: string;
    payloads?: PayloadItem[];
    sections?: PayloadSection[];
}

const payloadsData = webPayloads as PayloadCategory[];

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const IconFont = createFromIconfontCN({
    scriptUrl: ['./iconfont.js']
});

export default function Payloads() {
    const { token } = theme.useToken();
    const [selectedCategory, setSelectedCategory] = useState<string>(payloadsData[0].value);

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    const currentCategoryData = payloadsData.find(p => p.value === selectedCategory);

    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content);
        message.success('Payload copied to clipboard');
    };

    const injectPayload = async (payload: string) => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab.id) {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (text) => {
                        const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
                        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                            const start = activeElement.selectionStart || 0;
                            const end = activeElement.selectionEnd || 0;
                            const currentValue = activeElement.value;
                            activeElement.value = currentValue.substring(0, start) + text + currentValue.substring(end);
                            activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
                            activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                            activeElement.dispatchEvent(new Event('change', { bubbles: true }));
                        } else {
                            console.warn('No active input element found to inject payload');
                        }
                    },
                    args: [payload]
                });
                message.success('Payload injected into active input');
            }
        } catch (error) {
            console.error('Injection failed:', error);
            message.error('Failed to inject payload. Ensure you have permission.');
        }
    };

    const renderPayloadItem = (item: PayloadItem) => (
        <List.Item
            actions={[
                <Tooltip title="Copy to Clipboard">
                    <Button 
                        type="text" 
                        icon={<CopyOutlined />} 
                        onClick={() => copyToClipboard(item.content)}
                    />
                </Tooltip>,
                <Tooltip title="Inject Payload">
                    <Button 
                        type="text" 
                        icon={<ThunderboltOutlined />} 
                        onClick={() => injectPayload(item.content)}
                    />
                </Tooltip>
            ]}
        >
            <List.Item.Meta
                title={
                    <Text strong style={item.subtitle ? { color: '#1890ff' } : undefined}>
                        {item.title || item.subtitle}
                    </Text>
                }
                description={
                    <div style={{ 
                        background: token.colorFillAlter, 
                        padding: '8px 12px', 
                        borderRadius: 4,
                        fontFamily: 'monospace',
                        color: token.colorText,
                        marginTop: 4,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        border: `1px solid ${token.colorBorder}`
                    }}>
                        {item.content}
                    </div>
                }
            />
        </List.Item>
    );

    return (
        <div>
            <Title level={2}>
                <IconFont type='icon-code' style={{ marginRight: 8 }} />
                Payloads
            </Title>
            <Paragraph type="secondary">
                Common attack payloads and exploit templates for penetration testing
            </Paragraph>

            <Card style={{ marginTop: 24 }}>
                <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ marginRight: 8 }}>Select Category:</Text>
                    <Select 
                        defaultValue={payloadsData[0].value} 
                        style={{ width: 300 }} 
                        onChange={handleCategoryChange}
                    >
                        {payloadsData.map(category => (
                            <Option key={category.value} value={category.value}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                </div>

                {currentCategoryData?.sections ? (
                    <div>
                        {currentCategoryData.sections.map((section, index) => (
                            <div key={index} style={{ marginBottom: 32 }}>
                                <Title level={4} style={{ marginBottom: 16 }}>{section.title}</Title>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={section.items}
                                    renderItem={renderPayloadItem}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={currentCategoryData?.payloads || []}
                        renderItem={renderPayloadItem}
                    />
                )}
            </Card>
        </div>
    );
}
