import React from 'react'
import {mount} from 'react-mounter'

import {MainLayout} from './layouts.jsx'

import Main from './components/common/Main.jsx'
import Splash from './components/common/Splash.jsx'

FlowRouter.route('/', {
  action () {
    mount(MainLayout, {
      content: (<Splash />)
    })
  }
})

FlowRouter.route('/new', {
  action () {
    mount(MainLayout, {
      content: (<Main />)
    })
  }
})

FlowRouter.route('/pathway/:id', {
  action () {
    mount(MainLayout, {
      content: (<Main />)
    })
  }
})
