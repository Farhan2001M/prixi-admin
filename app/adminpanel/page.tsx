'use client';


import Link from 'next/link';

import Header from '../components/header'
import Table from '../components/FTable/app'
const UserInterface = () => {

    return (
        <div className="flex flex-col">
            <Header/>
            
            <hr />
            <br />
            <br />
            
            <div className='w-11/12 mx-auto mt-5'>
                <Table/>
            </div>

        </div>  
    );
};

export default UserInterface;
