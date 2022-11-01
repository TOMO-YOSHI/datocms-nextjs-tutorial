import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts } from '../lib/posts';
// import Image from '../components/Image/Image';
// import Image from 'next/Image';
import styles from '../styles/Home.module.css';
import { request } from '../lib/datocms';
import { Image } from 'react-datocms';

const HOMEPAGE_QUERY = `
  query MyQuery {
    allArticles {
      title
      author {
        name
      }
      content {
        value
      }
      coverImage {
        responsiveImage {
          alt
          aspectRatio
          base64
          bgColor
          height
          sizes
          src
          srcSet
          title
          webpSrcSet
          width
        }
      }
      excerpt
      publishDate
      slug
    }
  }
`;

export async function getStaticProps() {
  const data = await request({
    query: HOMEPAGE_QUERY,
    // variables: { limit: 10 }
  });
  return {
    props: { data }
  };
}

export default function Home(props) {
  const { data } = props;
  console.log(data);
  const posts = data.allArticles;
  return (
    <div className={styles.container}>
      <Head>
        <title>Cooking with Tuomo</title>
      </Head>
      <div>
        <h1>Cooking w/Tuomo</h1>
      </div>
      <div>
        {
          posts.map(p => (
            <BlogPostPreview key={p.id} data={p} />
          ))
        }
      </div>
    </div>
  )
}

const BlogPostPreview = (props) => {
  const { data } = props;
  return (
    <div style={{maxWidth: "400px", marginBottom: "50px"}}>
      {/* <Image src={data.coverImage.url} alt={data.title} width="400" height="267" /> */}
      <Image data={data.coverImage.responsiveImage} />
        <Link href={`/blog/${data.slug}`}>
        {/* <a>{data.title}</a> */}
          <h2>
            {data.title}
          </h2>
        </Link>
      <div>{data.publishDate}</div>
      <p>{data.excerpt}</p>
      <div style={{ fontWeight: "bold" }}>{data.author.name}</div>
    </div>
  );
};



// const BlogPostPreview = (props) => {
//   const { data } = props;
//   return (
//     <div style={{ maxWidth: "400px", marginBottom: "50px" }}>
//       <Image src={data.coverImage} alt={data.title} layout="fill" />
//       <h2>
//         <Link href={`/blog/${data.slug}`}>
//           <a>{data.title}</a>
//         </Link>
//       </h2>
//       <div>{data.publishDate}</div>
//       <p>{data.excerpt}</p>
//       <div style={{ fontWeight: "bold" }}>{data.author}</div>
//     </div>
//   );
// };
