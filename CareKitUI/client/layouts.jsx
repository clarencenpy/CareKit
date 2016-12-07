import React from 'react'

import Header from './components/common/Header'

export const MainLayout = ({content}) => (
    <div className="main-layout">
      {content}
    </div>
)

export const HomeLayout = ({content}) => (
    <div className="home-layout">
      {content}
    </div>
)