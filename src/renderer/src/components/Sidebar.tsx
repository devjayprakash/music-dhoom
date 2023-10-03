import useSongStore from '@renderer/store/songStore'
import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { HiOutlineMusicalNote } from 'react-icons/hi2'
import { RxBookmark, RxDashboard, RxPerson } from 'react-icons/rx'
import { useLocation, useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const { setSearchQuery } = useSongStore()
  const location = useLocation()

  const handleSearch = (value: string) => {
    if (location.pathname !== '/all') {
      navigate(`/all`)
    }
    setSearchQuery(value)
  }

  return (
    <div className="w-[300px] flex-shrink-0 h-screen p-3 bg-black bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-50 z-50">
      <div className="flex justify-center items-center my-5 gap-2">
        <img width={50} src="/music.png" />
        <div className="text-white text-xl font-bold"> Music Dhoom</div>
      </div>
      <div className="flex rounded-md overflow-hidden">
        <input
          onChange={(e) => handleSearch(e.target.value)}
          type="text"
          className="w-full p-2 bg-white/40 outline-none text-white placeholder:text-gray-100"
          placeholder="Search ..."
        />
        <button className="bg-white/70 p-2 hover:bg-white/50">
          <AiOutlineSearch size={24} />
        </button>
      </div>
      <div className="space-y-3 mt-6">
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
