import React, { useEffect } from 'react';
import { Layout, Menu, Typography, theme, Button, Select, ConfigProvider, Switch } from 'antd';
import { CopyrightCircleOutlined, FullscreenOutlined, ArrowsAltOutlined, RocketOutlined, CloudServerOutlined, TranslationOutlined, SafetyCertificateOutlined, SearchOutlined, GlobalOutlined, CodeOutlined } from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';
import { goTo } from 'react-chrome-extension-router';
import ReverseShell from './linux/ReverseShell';
import PhpReverseShell from './web/PhpReverseShell';
import TtySpawnShell from './linux/TtySpawnShell';
import Hashing from './encoding/Hashing';
import LinuxCommands from './linux/LinuxCommands';
import PowershellCommands from './linux/PowershellCommands';

import AboutUs from './AboutUs';
import FileTransfer from './file_transfer/File_transfer';
import PersistedState from 'use-persisted-state';
import MSFBuilder from './linux/MSFBuilder';
import Notepad from './notepad/Notepad';
import Payloads from './payloads/Payloads';
import ServicesOverview from './services/ServicesOverview';
import Encoder from './encoding/Encoder';
import JWT from './jwt/JWT';
import Recon from './recon/Recon';
import Traffic from './traffic/Traffic';

const { Paragraph } = Typography;
const { Sider, Content, Footer } = Layout;
const IconFont = createFromIconfontCN( {
    scriptUrl: [ './iconfont.js' ]
} );

const useDarkModeState = PersistedState<boolean>('dark_mode');

export default function LayoutApp ( props: {
    children?: React.ReactNode;
} ) {

    const { defaultAlgorithm, darkAlgorithm } = theme;
    const [ darkMode, setDarkModeState ] = useDarkModeState( false );
    const handleSwtichTheme = ( value: string ) => {
        // Set the dark mode state based on the selected value
        // We can use the '===' operator because we know the value can only be 'dark' or 'light'.
        const isDarkMode = value === 'dark';
        setDarkModeState( isDarkMode );
    }

    interface IRouterComponent {
        key: string;
        icon: JSX.Element;
        name: string;
        componentRoute: React.FunctionComponent;
    }

    const Tabs: Array<IRouterComponent> = [
        {
            key: '1',
            icon: <CodeOutlined style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'Reverse Shell',
            componentRoute: ReverseShell
        },
        {
            key: '2',
            icon: <IconFont type='icon-lvzhou_yuanchengTelnet' style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'TTY Spawn Shell',
            componentRoute: TtySpawnShell
        },
        {
            key: '3',
            icon: <RocketOutlined style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'Payloads',
            componentRoute: Payloads
        },
        {
            key: '4',
            icon: <CloudServerOutlined style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'Services',
            componentRoute: ServicesOverview
        },
        {
            key: '5',
            icon: <IconFont type='icon-php' style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'PHP Reverse Shell',
            componentRoute: PhpReverseShell
        },
        {
            key: '6',
            icon: <IconFont type='icon-jiemaleixing' style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'Encoder',
            componentRoute: Encoder
        },
        {
            key: '7',
            icon: <IconFont type='icon-hash' style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'Hashing',
            componentRoute: Hashing
        },
        {
            key: '8',
            icon: <SafetyCertificateOutlined style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'JWT',
            componentRoute: JWT
        },
        {
            key: '9',
            icon: <IconFont type='icon-linux' style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'Useful Linux commands',
            componentRoute: LinuxCommands
        },
        {
            key: '10',
            icon: <IconFont type='icon-powershell' style={{ fontSize: '1.5em', marginTop: 3 }} />, 
            name: 'PowerShell Commands',
            componentRoute: PowershellCommands
        },
        {
            key: '11',
            icon: <SearchOutlined style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'Recon',
            componentRoute: Recon
        },
        {
            key: '12',
            icon: <GlobalOutlined style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'Traffic',
            componentRoute: Traffic
        },
        {
            key: '13',
            icon: <IconFont type='icon-transfer' style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'Transfer Methods',
            componentRoute: FileTransfer
        },
        {
            key: '14',
            icon: <IconFont type='icon-shield' style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'Venom Builder',
            componentRoute: MSFBuilder
        },
        {
            key: '15',
            icon: <IconFont type='icon-about' style={{ fontSize: '1.5em', marginTop: 3 }} />,
            name: 'About us',
            componentRoute: AboutUs
        }
    ];

    const MenuItemsLists = Tabs.map( ( item ) => (
        <Menu.Item style={{ overflow: 'hidden' }} key={item.key} icon={item.icon} onClick={() => navigate( item )}>
            {item.name}
        </Menu.Item>
    ) );

    const useMenuIndex = PersistedState<string>( 'tab_index_cache' ); // Disabled for now
    const [ index, setIndex ] = useMenuIndex( '1' );

    const navigate = ( { componentRoute, key }: { componentRoute: React.FunctionComponent; key: string } ) => {
        goTo( componentRoute );
        setIndex( key );
    };

    const windowMode = () => {
        const width = 1100;
        const height = 800;

        chrome.windows.create( {
            url: chrome.runtime.getURL( 'index.html' ),
            width: width,
            height: height,
            type: 'popup'
        } );
    };

    useEffect( () => {
        const foundTab = Tabs.find( ( obj ) => obj.key === index );
        if (foundTab) {
            goTo( foundTab.componentRoute );
        } else {
            // If the persisted index is not found (e.g. tab removed), default to the first tab
            goTo( Tabs[0].componentRoute );
            setIndex( Tabs[0].key );
        }
    }, [] );

    const target = window.location.href;

    const handleHatClick = () => {
        const notepad_route_ctx = {
            key: '1',
            name: 'Hat Clicked',
            componentRoute: Notepad
        }

        navigate( notepad_route_ctx );
    };

    return (
        <ConfigProvider
            theme={{
                "token": {
                    "wireframe": true,
                },
                algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
            }}

        >
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsed={true}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0
                    }}
                >
                    <div className='logo' onClick={handleHatClick}>
                        <svg
                            version="1.0"
                            xmlns="http://www.w3.org/2000/svg"
                            width="45"
                            height="35"
                            viewBox="0 0 2417.000000 1613.000000"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <g transform="translate(0.000000,1613.000000) scale(0.100000,-0.100000)" fill="#F0F2F5" stroke="none">
                                <path d="M11965 14168 c-393 -26 -776 -183 -1111 -454 -108 -87 -306 -289 -459 -468 -439 -512 -819 -1117 -1118 -1778 -242 -533 -477 -1250 -521 -1588 -6 -44 -6 -44 41 42 272 500 906 924 1737 1162 329 95 747 169 1076 191 52 3 113 8 135 10 82 9 638 5 777 -5 1349 -99 2459 -625 2868 -1361 l41 -74 -6 60 c-10 88 -38 214 -90 396 -312 1087 -826 2083 -1485 2874 -135 162 -334 377 -420 454 -270 242 -557 402 -865 482 -200 52 -396 70 -600 57z m470 -2368 c401 -22 765 -77 1023 -156 146 -44 95 -56 -128 -29 -458 55 -937 80 -1331 71 -147 -4 -293 -9 -325 -11 -33 -3 -124 -10 -204 -15 -147 -11 -499 -45 -570 -55 -95 -14 -261 -27 -267 -21 -13 12 12 25 100 50 439 127 1147 196 1702 166z"/>
                                <path d="M11805 11134 c-226 -18 -777 -113 -1060 -183 -1265 -314 -2042 -1042 -1910 -1792 42 -244 162 -455 380 -675 196 -197 381 -326 685 -479 633 -318 1457 -482 2320 -461 380 8 659 38 980 102 1173 234 2011 814 2145 1484 24 118 16 353 -14 460 -32 110 -131 302 -208 405 -324 430 -962 787 -1734 969 -152 36 -629 124 -799 148 -111 15 -214 20 -440 23 -162 1 -317 1 -345 -1z m651 -834 c571 -33 1066 -122 1562 -282 169 -54 192 -64 191 -82 0 -12 -6 -59 -12 -105 l-12 -84 -62 -13 c-127 -26 -283 -135 -327 -228 -42 -90 -89 -303 -181 -816 l-56 -315 -42 -38 c-308 -279 -667 -442 -1102 -498 -119 -15 -415 -15 -540 0 -382 47 -731 190 -1006 412 -68 55 -88 77 -92 102 -147 818 -195 1048 -238 1147 -52 118 -223 232 -373 248 l-61 7 -13 114 c-6 63 -9 118 -5 122 9 8 185 63 328 103 193 53 546 126 730 149 222 29 250 32 415 46 52 4 98 6 103 4 4 -2 7 -254 7 -559 l0 -554 540 0 540 0 0 215 0 215 -100 0 -100 0 0 -120 0 -120 -342 2 -343 3 -3 455 c-1 250 0 461 3 468 6 15 332 17 591 2z"/>
                                <path d="M11470 8705 l0 -95 680 0 680 0 0 95 0 95 -680 0 -680 0 0 -95z"/>
                                <path d="M11830 8435 l0 -85 315 0 315 0 0 85 0 85 -315 0 -315 0 0 -85z"/>
                                <path d="M9243 7992 c-555 -391 -947 -756 -1175 -1095 -121 -180 -193 -357 -297 -723 -180 -640 -446 -1903 -471 -2240 -35 -461 69 -814 311 -1053 162 -161 537 -368 927 -512 132 -49 392 -129 419 -129 11 0 13 15 8 73 -3 39 -17 214 -30 387 -35 440 -102 1269 -121 1490 l-16 185 -73 91 c-166 204 -382 378 -645 518 -58 31 -102 56 -99 56 4 0 60 -18 125 -41 207 -71 428 -187 589 -309 91 -69 87 -68 80 -13 -3 26 -21 246 -40 488 -19 242 -42 519 -50 615 -8 96 -22 265 -31 375 -21 255 -17 334 21 411 38 78 110 148 189 185 68 32 132 41 356 53 63 4 138 9 165 11 64 7 559 32 870 45 920 38 2218 46 3115 20 496 -15 1427 -59 1590 -75 25 -2 90 -7 145 -10 174 -11 255 -44 343 -140 53 -57 85 -127 97 -205 3 -26 -11 -258 -34 -540 -57 -688 -89 -1089 -97 -1194 l-7 -90 59 46 c160 123 404 255 595 321 158 55 164 53 44 -10 -202 -108 -336 -204 -489 -352 -111 -108 -224 -242 -231 -275 -2 -11 -40 -475 -85 -1031 -44 -555 -82 -1027 -84 -1048 -2 -20 -2 -37 2 -37 3 0 67 18 143 40 354 102 733 273 1009 454 265 174 412 394 477 713 14 71 18 137 18 338 -1 283 1 273 -110 830 -206 1036 -404 1799 -540 2080 -164 341 -524 725 -1050 1122 -143 108 -364 263 -376 263 -5 0 -46 -24 -91 -53 -562 -361 -1277 -582 -2128 -659 -216 -19 -789 -16 -1010 6 -817 81 -1490 289 -2033 629 -73 45 -134 83 -138 85 -3 1 -69 -42 -146 -96z"/>
                                <path d="M11135 6703 c-565 -15 -861 -25 -915 -28 -36 -2 -128 -7 -205 -10 -77 -3 -176 -8 -220 -10 -44 -2 -127 -7 -185 -10 -58 -3 -136 -8 -175 -10 -38 -3 -113 -7 -165 -10 -322 -21 -356 -30 -415 -114 -29 -41 -30 -47 -29 -140 1 -81 12 -224 39 -541 3 -30 9 -111 15 -180 5 -69 12 -152 15 -185 5 -60 54 -660 100 -1235 14 -168 27 -332 30 -365 3 -33 21 -256 40 -495 57 -701 65 -802 71 -858 l5 -52 2953 0 2952 0 18 218 c9 119 32 406 51 637 19 231 50 618 70 860 19 242 42 519 50 615 49 578 125 1548 125 1600 0 33 -6 75 -13 93 -19 44 -88 104 -134 116 -93 23 -1218 80 -2028 101 -318 8 -1784 11 -2050 3z m1330 -2503 l-385 -385 -382 383 -383 382 385 385 385 385 382 -382 383 -383 -385 -385z"/>
                                <path d="M11830 4835 l-255 -255 253 -252 252 -253 255 255 255 255 -253 253 -252 252 -255 -255z"/>
                                <path d="M9156 2253 c12 -56 58 -138 101 -181 24 -24 74 -58 111 -75 l67 -32 2660 0 2660 0 67 33 c83 41 158 120 187 197 12 31 21 62 21 70 0 13 -367 15 -2940 15 l-2940 0 6 -27z"/>
                            </g>
                        </svg>
                    </div>

                    <Menu theme='dark' defaultSelectedKeys={[ index ]} mode='inline'>
                        {MenuItemsLists}
                    </Menu>
                </Sider>
                <Layout className='site-layout' style={{ marginLeft: 80 }}>
                    <Content style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                        minHeight: 360,
                        padding: 14,
                        borderRadius: 8,
                        background: darkMode ? '#0f0f0f' : '#fff',
                    }}>
                        {props.children}
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        <CopyrightCircleOutlined /> Secfinity - The all in one Red team browser extension for web
                        pentesters
                        <Paragraph style={{ textAlign: 'center' }}>Sareer A.</Paragraph>
                        <pre style={{ textAlign: 'center' }}>Secfinity Version - 0.5.0</pre>
                        <Button icon={<FullscreenOutlined style={{ margin: 5 }} />} type='link'>
                            <a href={target} rel='noreferrer noopener' target='_blank'>
                                Fullscreen mode
                            </a>
                        </Button>
                        <Select
                            defaultValue={darkMode ? 'dark' : 'light'}
                            style={{ width: 150 }}
                            onChange={handleSwtichTheme}
                            options={[
                                {
                                    value: 'light',
                                    label: 'Light',
                                },
                                {
                                    value: 'dark',
                                    label: 'Dark',
                                },
                            ]}
                        />
                        <Button icon={<ArrowsAltOutlined style={{ margin: 5 }} />} onClick={() => windowMode()} type='link'>
                            Pop-up mode
                        </Button>
                    </Footer>
                </Layout>
            </Layout >
        </ConfigProvider >
    );
}
