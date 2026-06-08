import React from 'react'

import ItemProps from '../interfaces/ItemProps'

interface ListProps {
    items: ItemProps[]
}

const List = ({
    items
}: ListProps) => {
    
    const renderListItems = (items: ItemProps[]) => {
        return items.map(item => {
            return (
                <div className='item flex items-start'>
                    <div className='w-8 shrink-0 mt-1.5'>
                        <div className='dot rounded-full bg-primary h-4 w-4' />
                    </div>
                    <div className='pl-4 min-w-0'>
                        <span className='text-base font-bold'>
                            {item.bold}
                        </span>
                        { item.content }
                    </div>
                </div>
            )
        })
    }

    return (
        <div className='List grid grid-rows-auto gap-4'>
            { renderListItems(items) }
        </div>
    )
}

export default List