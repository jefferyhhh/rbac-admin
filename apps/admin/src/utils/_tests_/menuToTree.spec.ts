import { menuToTree, toMenuTreeItem, toSelectorType } from '../menuToTree'
import { menuIput, menuOutput, selectorOutput } from './testData'
import { describe, it, expect } from 'vitest'

describe('listToTree', () => {
  it('MenuItem[] to MenuTreeItem[]', () => {
    const result = menuToTree(menuIput, toMenuTreeItem)
    expect(result).toEqual(menuOutput)
  })

  it('MenuItem[] to SelectorType[] ', () => {
    const result = menuToTree(menuIput, toSelectorType)
    console.log(result)

    expect(result).toEqual(selectorOutput)
  })
})
