// import Image from 'next/image'
// import { Inter } from 'next/font/google'

import { GetStaticProps, NextPage } from "next"
import homeStyles from '../styles/Home.module.css';
import Head from "next/head";
import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";


// const inter = Inter({ subsets: ['latin'] })

const Home = ({allPostsData}:{
  allPostsData:{
    date:string,title:string,id:string
  }[]
}) => {
  console.log('allPostsData->',allPostsData)
  return (
    <div>
      <Head>
        <title>Your Name</title>
      </Head>
      <section className={homeStyles.headingMd} >
        <p>[Your self introduction]</p>
        <p>(This is a website )</p>
      </section>
      <section className={`${homeStyles.headingMd} ${homeStyles.padding1px}`}>
        <h2 className={homeStyles.headingLg}>Blog</h2>
        <ul className={homeStyles.list}>
          {allPostsData.map(({date,title,id}) => (
            <li className={homeStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}> /posts/ssg-ssr
              <span>{title}</span>
              </Link>
              <br />
              <small className={homeStyles.lightText}>
                {date}
              </small>
            </li>
          ))}
          
        </ul>
      </section>
    </div>
  )
}
export default Home

export const getStaticProps:GetStaticProps = async () => {
  const allPostsData = getSortedPostsData()
  return{
    props:{
      allPostsData //date, title, id

    }
  }
}


//getStaticProps함수를 async로 export하면, getStaticProps에서 return되는 props를 가지고 
//페이지를 pre-render한다. build time에 페이지를 렌더링한다