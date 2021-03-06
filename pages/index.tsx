import { useEffect } from 'react'
import type { NextPage } from 'next'
import toast, { Toaster } from 'react-hot-toast'

import { useWeb3 } from '@3rdweb/hooks'
import { client } from '../lib/sanityClient.js'

import Header from '../components/Header.js'
import Hero from '../components/Hero.js'


const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `bg-[#2081e2] p-[0.8rem] text-lg font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text-white font-semibold mt-4`,
}

const Home: NextPage = () => {
  const { address, connectWallet } = useWeb3()

  const welcomeUser = (userName = '', toastHandler = toast) => {
    toastHandler.success(
      `Welcome back${userName !== 'Unnamed' ? ` ${userName}` : ''}!`,
      {
        style: {
          background: '#04111d',
          color: '#fff',
        },
      }
    )
  }

  useEffect(() => {
    if (!address) return
    ;(async () => {
      const userDoc = {
        _type: 'users',
        _id: address,
        userName: 'Unnamed',
        walletAddress: address,
      }

      const result = await client.createIfNotExists(userDoc)
      welcomeUser(result.userName)
    })()
  }, [address])

  return (
    <div className={style.wrapper}>
      <Toaster position="top-center" reverseOrder={false} />
      {address ? (
        <>
          <Header />
          <Hero />
        </>
      ) : (
        <div className={style.walletConnectWrapper}>
          <button
            className={style.button}
            onClick={() => connectWallet('injected')}
          >
            Connect Wallet
          </button>
          <div className={style.details}>
            You need Chrome to be able to run this app.
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
