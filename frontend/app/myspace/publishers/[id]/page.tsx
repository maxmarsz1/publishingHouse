import React from 'react'


interface Props {
  params: { id: string };
}

const Publisher = async ({ params }: Props) => {
  const { id } = params;
  return (
    <div>
      <h1>Publisher ID: {id}</h1>
    </div>
  )
}

export default Publisher