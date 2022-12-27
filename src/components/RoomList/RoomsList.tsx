import './RoomList.scss'

import clsx from 'clsx'
import React, { useMemo } from 'react'

import { TOP_VIEW } from '../../consts/names'
import { ContentData } from '../../contracts/content-data'

type RoomsListProps = {
  data: ContentData
  selected: string
  className?: string
  roomClick: (name: string) => void
}

export const RoomsList: React.FC<RoomsListProps> = ({
  data,
  roomClick,
  selected,
  className,
}) => {
  const rooms = useMemo(() => {
    const { tour: { rooms = {} } = {} } = data
    return Object.values(rooms)
  }, [data])
  return (
    <div className={clsx('room-demo-room-list', className)}>
      <button
        onClick={() => roomClick(TOP_VIEW)}
        className={clsx(
          'room-list-button',
          'top',
          selected === TOP_VIEW && 'selected',
        )}
      >
        Top
      </button>
      {rooms.map(({ name }) => (
        <button
          className={clsx('room-list-button', selected === name && 'selected')}
          key={name}
          onClick={() => roomClick(name)}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
