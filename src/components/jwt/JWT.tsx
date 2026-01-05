import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Input, Button, Space, Divider, message, Tag } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import { parseJWT, signJWT, createNoneToken, stringToBase64Url } from '../../utils/jwtUtils';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const IconFont = createFromIconfontCN({
    scriptUrl: ['./iconfont.js']
});

export default function JWT() {
    const [token, setToken] = useState<string>('');
    const [headerText, setHeaderText] = useState<string>('{}');
    const [payloadText, setPayloadText] = useState<string>('{}');
    const [secret, setSecret] = useState<string>('');
    const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

    // Handle Token Change (Parse)
    const handleTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newToken = e.target.value;
        setToken(newToken);
        
        if (!newToken) {
            setHeaderText('{}');
            setPayloadText('{}');
            setIsTokenValid(false);
            return;
        }

        try {
            const parsed = parseJWT(newToken);
            setHeaderText(JSON.stringify(parsed.header, null, 4));
            setPayloadText(JSON.stringify(parsed.payload, null, 4));
            setIsTokenValid(true);
        } catch (error) {
            // Don't clear texts immediately on every keystroke error, 
            // but maybe mark as invalid.
            setIsTokenValid(false);
        }
    };

    // Handle Sign (Encode)
    const handleSign = () => {
        try {
            const header = JSON.parse(headerText);
            const payload = JSON.parse(payloadText);
            
            if (!secret) {
                message.warning("Please enter a secret to sign the token");
                return;
            }

            const newToken = signJWT(header, payload, secret);
            setToken(newToken);
            setIsTokenValid(true);
            message.success("Token signed and updated!");
        } catch (error) {
            message.error("Invalid JSON in Header or Payload");
        }
    };

    // Handle None Attack
    const handleNoneAttack = () => {
        try {
            const header = JSON.parse(headerText);
            const payload = JSON.parse(payloadText);
            
            // Force alg to none
            header.alg = 'none';
            setHeaderText(JSON.stringify(header, null, 4));

            // Construct token: base64(header).base64(payload).
            const encodedHeader = stringToBase64Url(JSON.stringify(header));
            const encodedPayload = stringToBase64Url(JSON.stringify(payload));
            
            const newToken = `${encodedHeader}.${encodedPayload}.`;
            setToken(newToken);
            setIsTokenValid(true);
            message.success("Generated 'None' algorithm token!");
        } catch (error) {
            message.error("Invalid JSON in Header or Payload");
        }
    };

    return (
        <div>
            <Title level={2}>
                <IconFont type='icon-shield' style={{ marginRight: 8 }} />
                JWT Tools
            </Title>
            <Paragraph type="secondary">
                Decode, verify, and tamper with JSON Web Tokens.
            </Paragraph>

            <Row gutter={[24, 24]}>
                {/* Left Column: Token Input */}
                <Col span={10}>
                    <Card title="Encoded Token" bordered={false} style={{ height: '100%' }}>
                        <TextArea 
                            rows={20} 
                            value={token} 
                            onChange={handleTokenChange} 
                            placeholder="Paste JWT here (e.g. eyJhbG...)"
                            style={{ fontFamily: 'monospace', resize: 'none' }}
                        />
                        <div style={{ marginTop: 16 }}>
                            <Tag color={isTokenValid ? "success" : "error"}>
                                {isTokenValid ? "Valid Format" : "Invalid Format"}
                            </Tag>
                        </div>
                    </Card>
                </Col>

                {/* Right Column: Decoded Data */}
                <Col span={14}>
                    <Card title="Decoded Data" bordered={false}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Header</Text>
                                <TextArea 
                                    rows={6} 
                                    value={headerText} 
                                    onChange={e => setHeaderText(e.target.value)}
                                    style={{ fontFamily: 'monospace', color: '#d91e18' }} // Red for header
                                />
                            </div>
                            <div>
                                <Text strong>Payload</Text>
                                <TextArea 
                                    rows={10} 
                                    value={payloadText} 
                                    onChange={e => setPayloadText(e.target.value)}
                                    style={{ fontFamily: 'monospace', color: '#8e44ad' }} // Purple for payload
                                />
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Divider orientation="left">Signature & Attacks</Divider>

            <Card bordered={false}>
                <Row gutter={16} align="middle">
                    <Col span={12}>
                        <Input.Password 
                            placeholder="HMAC Secret Key (e.g. mysecret)" 
                            value={secret}
                            onChange={e => setSecret(e.target.value)}
                        />
                    </Col>
                    <Col span={12}>
                        <Space>
                            <Button type="primary" onClick={handleSign}>
                                Sign Token (HS256)
                            </Button>
                            <Button danger onClick={handleNoneAttack}>
                                Apply "None" Attack
                            </Button>
                        </Space>
                    </Col>
                </Row>
                <div style={{ marginTop: 16 }}>
                    <Paragraph type="secondary" style={{ fontSize: 12 }}>
                        * Signing uses HMAC-SHA256 (HS256). Ensure the header 'alg' is set to 'HS256'.
                        <br/>
                        * "None" Attack sets 'alg' to 'none' and removes the signature.
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
}
