import React from 'react';
import Sidemenu from '../components/Sidemenu/Sidemenu';

type templateProps = {
    title: string,
    subtitle: string,
    children?: React.ReactNode,
};

const Template: React.FC<templateProps> = ({ children, title, subtitle }) => {
    return (
        <div className='main-container'>
            <Sidemenu/>
            <main className='ml-[14rem] p-8'>
                <header>
                    <h1 className='text-3xl font-bold'>{title}</h1>
                    <h2 className='font-normal'>{subtitle}</h2>
                </header>
                <section>
                    {children}
                </section>
            </main>
        </div>
    );
};

export default Template;