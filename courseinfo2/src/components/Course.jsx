const Course = (props) => {
    const course = props.course
    return (
      <>
        <Header title={course.name}></Header>
        <Content parts={course.parts}></Content>
        <Sum parts={course.parts}></Sum>
      </>
    )
  }
  
const Header = (props) => {
    return <><h2>{props.title}</h2></>
}

const Content = (props) => {
    const parts = props.parts
    return (
        <ul>
        {parts.map(part => <li key={part.id}><Part part={part}></Part></li>)}
        </ul>
    )
}

const Part = (props) => {
    const part = props.part
    return <>{part.name} {part.exercises}</>
}

const Sum = (props) => {
    const sum = props.parts.reduce((s,part) => s += part.exercises, 0)
    return (
    <p>Total exercises: {sum}</p>
    )
}

export default Course