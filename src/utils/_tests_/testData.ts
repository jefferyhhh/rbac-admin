export const menuIput: MenuItem[] = [
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

export const menuOutput: MenuTreeItem[] = [
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

export const selectorOutput: SelectorType[] = [
  {
    children: [
      {
        children: [
          {
            children: [],
            label: 'Grandchild 1',
            value: 3
          }
        ],
        label: 'Child 1',
        value: 2
      }
    ],
    label: 'Root',
    value: 1
  }
]
