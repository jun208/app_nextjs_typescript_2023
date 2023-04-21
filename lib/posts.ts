import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(),'posts');
console.log('process.cwd()', process.cwd());
// C:\projects\app_nextjs_typescript_2023/
console.log('postsDirectory',postsDirectory);
// C:\projects\app_nextjs_typescript_2023/posts

export function  getSortedPostsData(){
  const fileNames = fs.readdirSync(postsDirectory);//동기식Sync, 비동기식 async
  console.log('fileNames->',fileNames); 
  // fileNames['pre-rendering.md','ssg-ssr.md']
  const allPostsData = fileNames.map(fileName => {
    const id =fileName.replace(/\.md$/, ''); // /. 점을나타냄, $끝남
    //id = 'pre-rendering' 
    const fullPath = path.join(postsDirectory, fileName)
    // C:\projects\app_nextjs_typescript_2023/posts/pre-rendering.md
    const fileContents = fs.readFileSync(fullPath, 'utf8');//파일 내용
    const matterResult = matter(fileContents); //객체변환
    console.log('matterResult->',matterResult);
    return{
      id,
      ...(matterResult.data as {date:string; title:string}) //type assertion
    }
  });//allPostsData

  return allPostsData.sort((a,b)=>{//.sort숫자는 정렬이 안됨
    if(a.date < b.date){
      return 1
    }else{
      return -1
    }
  }) 
}//getSortedPostsData


export function getAllPostIds(){
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map(fileName =>{
    return{
      params: {
        id: fileName.replace(/.\md$/, '') //id = 'pre-rendering' id = 'ssg-ssr.'
      }
    }
  })
}

export async function getPostData(id:string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  // C:\projects\app_nextjs_typescript_2023/posts/pre-rendering.md
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents); //객체변환
  const processedContent = await remark()
                                .use(html)
                                .process(matterResult.content)  //remark는 markdown을 html로 변환
                                //npm install remark remark-html --save
  const contentHtml = processedContent.toString();

  return{
    id,
    contentHtml,
    ...(matterResult.data as {data:string, title:string})

  }
  
}
