import React from 'react'
import {mount} from 'react-mounter'

import {MainLayout} from './layouts.jsx'
import {HomeLayout} from './layouts.jsx'

import Main from './components/common/Main.jsx'
import Home from './components/common/Home.jsx'

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

FlowRouter.route('/', {
  action () {
    mount(HomeLayout, {
      content: (<Home />)
    })
  }
})
