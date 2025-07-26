import React from 'react'
import PublishersContainer from "../../components/publisher/PublishersContainer"
import { Publisher } from '@/app/types/types'


function getUserPublishers(){
  const dumpPublishers: Publisher[] = [
    {id: 1, name: "Publisher 1", description: "Publisher 1 description "},
    {id: 2, name: "Publisher 2", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque enim, exercitationem neque placeat fugit ducimus dicta nostrum illo! Quas dolore nam quisquam maxime laboriosam asperiores in, dolor doloribus perferendis a velit fuga! Iure quam adipisci ab reiciendis nihil dicta natus. Obcaecati rem ea expedita, dolores perspiciatis nisi voluptatum alias hic doloribus optio qui minima, magnam id? Porro unde ea architecto, distinctio eius similique dignissimos modi eos voluptatibus, adipisci facilis, quae aliquid praesentium suscipit fugiat itaque? Sapiente tempora iste facilis nihil molestias quisquam explicabo itaque, iure totam dolores esse non in magnam incidunt? Maiores id ipsam neque amet, veniam maxime assumenda?"},
  ]

  return dumpPublishers
}

const Publishers = () => {
  const publishers = getUserPublishers();

  return (
    <>
      <PublishersContainer publishers={publishers} />
    </>
  )
}

export default Publishers