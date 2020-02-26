/*
* 另开页面的 a 标签
* */
import React from 'react';

export default function BlankLink({ className, children, href = '' }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}
