import React from 'react'

import Sidebar from '../components/MUI/Sidebar'
import Link from 'next/link'

const header = () => {
  return (
    <div className='flex justify-between items-center'>
        <Sidebar/>
        <h1 className="text-center text-4xl pl-6 font-medium">Admin Panel</h1>
        <Link href="/adminpanel" className='my-auto mx-3'><img className="w-[120px] " src="/images/PBlogo.png" alt="" /></Link> 
    </div>
  )
}

export default header