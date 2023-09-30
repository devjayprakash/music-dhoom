import React from 'react'
import { HiOutlineMusicalNote } from 'react-icons/hi2'
import { RxBookmark, RxDashboard, RxPerson } from 'react-icons/rx'
import { useLocation, useNavigate } from 'react-router-dom'

interface SidebarNavProps {
  to: string
  title: string
  icon: React.ReactNode
}

const SidebarNav: React.FC<SidebarNavProps> = ({ to, title, icon }) => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div
      onClick={() => {
        navigate(to)
      }}
      className={`${
        location.pathname.startsWith(to) && 'bg-black/20'
      } w-full flex text-white border border-gray-200/20 gap-2 cursor-pointer bg-opacity-30 items-center font-light bg-gray-200 p-2 rounded-md hover:bg-opacity-50 select-none`}
    >
      {icon}
      <div>{title}</div>
    </div>
  )
}

const Sidebar: React.FC = () => {
  const side_nav_data: Array<SidebarNavProps & { id: string }> = [
    {
      id: 'nav_1',
      title: 'All Music',
      to: '/all',
      icon: <RxDashboard />
    },
    {
      id: 'nav_2',
      title: 'History',
      to: '/history',
      icon: <RxBookmark />
    },
    {
      id: 'nav_3',
      title: 'Playing',
      to: '/current',
      icon: <HiOutlineMusicalNote />
    },
    {
      id: 'nav_4',
      title: 'Profile',
      to: '/profile',
      icon: <RxPerson />
    }
  ]

  return (
    <div className="w-[400px] flex-shrink-0 h-screen p-3 bg-black bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-50">
      <div className="flex justify-center items-center my-5 gap-2">
        <img width={40} src="/music.png" />
        <div className="text-rose-600 font-bold"> Music Dhoom</div>
      </div>
      <div className="space-y-3">
        {side_nav_data.map((side_bar_data) => (
          <SidebarNav
            icon={side_bar_data.icon}
            key={side_bar_data.id}
            to={side_bar_data.to}
            title={side_bar_data.title}
          />
        ))}
      </div>
    </div>
  )
}

export default Sidebar
