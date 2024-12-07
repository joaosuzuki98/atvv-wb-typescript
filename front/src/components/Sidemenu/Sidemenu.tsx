import React, { useState } from 'react';
import { NavLink } from 'react-router';
import {
    HomeOutlined,
    UserOutlined,
    ProductOutlined,
    CoffeeOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: '1',
        icon: <HomeOutlined />,
        label: (
            <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'active-link' : ''}
            >
                Dashboard
            </NavLink>
        ),
    },
    {
        key: '2',
        icon: <UserOutlined />,
        label: (
            <NavLink 
                to="/clientes" 
                className={({ isActive }) => isActive ? 'active-link' : ''}
            >
                Clientes
            </NavLink>
        ),
    },
    {
        key: '3',
        icon: <ProductOutlined />,
        label: (
            <NavLink 
                to="/produtos" 
                className={({ isActive }) => isActive ? 'active-link' : ''}
            >
                Produtos
            </NavLink>
        ),
    },
    {
        key: '4',
        icon: <CoffeeOutlined />,
        label: (
            <NavLink 
                to="/servicos" 
                className={({ isActive }) => isActive ? 'active-link' : ''}
            >
                Serviços
            </NavLink>
        ),
    },
    {
        key: '5',
        icon: <PieChartOutlined />,
        label: (
            <NavLink 
                to="/analise" 
                className={({ isActive }) => isActive ? 'active-link' : ''}
            >
                Análise
            </NavLink>
        ),
    },
];

const Sidemenu: React.FC = () => {
    // const [collapsed, setCollapsed] = useState(false);

    return (
        <nav className="w-56 h-screen flex flex-col bg-[#001529] fixed top-0 left-0 z-10">
            <div className="h-16 flex items-center justify-center text-white text-2xl font-bold">
                WB
            </div>

            <Menu
                mode="inline"
                theme="dark"
                // inlineCollapsed={collapsed}
                items={items}
                className="flex-1"
            />

            <p className='text-gray-500 text-center text-[.8rem] mb-2 w-[80%] mx-auto'>
                Desenvolvido por <a href="https://portfolio-digital-mcln-hlzdim5sj-suzuki-s-projects.vercel.app/" className='text-blue-400'>João Suzuki</a> 
            </p>
        </nav>
    );
};

export default Sidemenu;