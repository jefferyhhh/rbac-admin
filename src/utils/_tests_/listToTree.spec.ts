import { listToTree } from '@/utils/util'
import type { MenuItem } from '@/api/user'
import type { MenuTreeItem } from '@/utils/util'
import { describe, it, expect } from 'vitest'

describe('listToTree', () => {
  it('should handle an empty array', () => {
    const input: MenuItem[] = []
    const result = listToTree(input)
    expect(result).toEqual([])
  })
  it('should convert a single root item into a tree', () => {
    const input: MenuItem[] = [
      {
        available: true,
        cache: false,
        component_path: null,
        created_at: '2023-01-01T00:00:00Z',
        description: null,
        hidden: false,
        icon: 'home',
        id: 1,
        name: 'Root',
        order: 1,
        parent_id: null,
        parent_name: null,
        permission: 'root',
        redirect: '',
        route_name: 'root',
        route_path: '/root',
        type: 1,
        updated_at: '2023-01-01T00:00:00Z'
      }
    ]
    const expectedOutput: MenuTreeItem[] = [
      {
        available: true,
        cache: false,
        component_path: null,
        created_at: '2023-01-01T00:00:00Z',
        description: null,
        hidden: false,
        icon: 'home',
        id: 1,
        name: 'Root',
        order: 1,
        parent_id: null,
        parent_name: null,
        permission: 'root',
        redirect: '',
        route_name: 'root',
        route_path: '/root',
        type: 1,
        updated_at: '2023-01-01T00:00:00Z',
        children: []
      }
    ]
    const result = listToTree(input)
    expect(result).toEqual(expectedOutput)
  })
  it('should correctly convert a nested structure', () => {
    const input: MenuItem[] = [
      {
        available: true,
        cache: false,
        component_path: null,
        created_at: '2023-01-01T00:00:00Z',
        description: null,
        hidden: false,
        icon: 'home',
        id: 1,
        name: 'Root',
        order: 1,
        parent_id: null,
        parent_name: null,
        permission: 'root',
        redirect: '',
        route_name: 'root',
        route_path: '/root',
        type: 1,
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        available: true,
        cache: false,
        component_path: null,
        created_at: '2023-01-01T00:00:00Z',
        description: null,
        hidden: false,
        icon: 'sub',
        id: 2,
        name: 'Child 1',
        order: 2,
        parent_id: 1,
        parent_name: 'Root',
        permission: 'child1',
        redirect: '',
        route_name: 'child1',
        route_path: '/child1',
        type: 2,
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        available: true,
        cache: false,
        component_path: null,
        created_at: '2023-01-01T00:00:00Z',
        description: null,
        hidden: false,
        icon: 'grandchild',
        id: 3,
        name: 'Grandchild 1',
        order: 3,
        parent_id: 2,
        parent_name: 'Child 1',
        permission: 'grandchild1',
        redirect: '',
        route_name: 'grandchild1',
        route_path: '/grandchild1',
        type: 3,
        updated_at: '2023-01-01T00:00:00Z'
      }
    ]
    const expectedOutput: MenuTreeItem[] = [
      {
        available: true,
        cache: false,
        component_path: null,
        created_at: '2023-01-01T00:00:00Z',
        description: null,
        hidden: false,
        icon: 'home',
        id: 1,
        name: 'Root',
        order: 1,
        parent_id: null,
        parent_name: null,
        permission: 'root',
        redirect: '',
        route_name: 'root',
        route_path: '/root',
        type: 1,
        updated_at: '2023-01-01T00:00:00Z',
        children: [
          {
            available: true,
            cache: false,
            component_path: null,
            created_at: '2023-01-01T00:00:00Z',
            description: null,
            hidden: false,
            icon: 'sub',
            id: 2,
            name: 'Child 1',
            order: 2,
            parent_id: 1,
            parent_name: 'Root',
            permission: 'child1',
            redirect: '',
            route_name: 'child1',
            route_path: '/child1',
            type: 2,
            updated_at: '2023-01-01T00:00:00Z',
            children: [
              {
                available: true,
                cache: false,
                component_path: null,
                created_at: '2023-01-01T00:00:00Z',
                description: null,
                hidden: false,
                icon: 'grandchild',
                id: 3,
                name: 'Grandchild 1',
                order: 3,
                parent_id: 2,
                parent_name: 'Child 1',
                permission: 'grandchild1',
                redirect: '',
                route_name: 'grandchild1',
                route_path: '/grandchild1',
                type: 3,
                updated_at: '2023-01-01T00:00:00Z',
                children: []
              }
            ]
          }
        ]
      }
    ]
    const result = listToTree(input)
    expect(result).toEqual(expectedOutput)
  })
})
