// import Image from 'next/Image';
import { Image, StructuredText } from 'react-datocms';
import Link from 'next/link';
import { getPostData } from '../../lib/posts.js';
import styles from '../../styles/BlogPost.module.css';
import { request } from '../../lib/datocms.js';

export default function BlogPost(props) {
  const { postData } = props;
  console.log(postData);
  return (
    <div className={styles.container}>
      <div style={{ maxWidth: "600px", marginTop: "20px" }}>
        {/* <Image
          src={postData.coverImage}
          alt={postData.title}
          width="600"
          height="400"
        /> */}
      <Image data={postData.coverImage.responsiveImage} />
      <h1>{postData.title}</h1>
        <p>{postData.author.name} / {postData.publishDate}</p>
        <StructuredText
          data={postData.content}
          renderBlock={({ record }) => {
            switch (record.__typename) {
              case "ImageRecord":
                return <Image data={record.image.responsiveImage}/>;
              default:
                return null;
            }
          }}
        />
        <div style={{marginTop: "50px"}}>
          <Link href="/">
            <p>←&nbsp;&nbsp;Back to the front page</p>
          </Link>
        </div>
      </div>
    </div>
  )
};

const PATHS_QUERY = `
  query MyQuery {
    allArticles {
      slug
    }
  }
`;

export const getStaticPaths = async() => {
  const slugQuery = await request({
    query: PATHS_QUERY,
  });

  const paths = slugQuery.allArticles.map((p) => `/blog/${p.slug}`);

  return {
    paths,
    fallback: false
  };
};

const ARTICLE_QUERY = `
  query MyQuery($slug: String) {
    article(filter: {slug: {eq: $slug}}) {
      author {
        name
      }
      content {
        value
        blocks {
          __typename
          ... on ImageRecord {
            id
            image {
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
          }
        }
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
      id
      publishDate
      slug
      title
    }
  }
`;

export const getStaticProps = async({ params }) => {
  const post = await request({
    query: ARTICLE_QUERY,
    variables: { slug: params.slug }
  })
  
  return {
    props: {
      postData: post.article
    }
  }
};