import React from 'react'
import { Layout } from 'antd'

const { Footer } = Layout

const CustomFooter: React.FC = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      ©{new Date().getFullYear()} Created by daixiongsheng
    </Footer>
  )
}

export default CustomFooter
