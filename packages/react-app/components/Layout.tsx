import { FC, ReactNode } from 'react'
import { AuthGate } from './AuthGate'
import { Header } from './Header'

interface Props {
  children: ReactNode
}
const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="bg-gypsum flex min-h-screen justify-center">

      <div
        style={{ imageRendering: 'pixelated' }}
        className=" w-full max-w-[420px] bg-[url('/pixel_room_background.png')] bg-cover bg-center bg-no-repeat flex min-h-screen flex-col"
      >
        <AuthGate>
          <Header></Header>
          {children}
        </AuthGate>
      </div>

    </div >
  )
}

export default Layout
