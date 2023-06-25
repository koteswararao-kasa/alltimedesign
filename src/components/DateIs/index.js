import {MdEdit} from 'react-icons/md'
import {CgProfile} from 'react-icons/cg'
import './index.css'

const DateIs = props => {
  const {information, deleteSelect} = props
  const deleteSelectedOne = () => {
    deleteSelect(information.id)
  }
  return (
    <div className="card">
      <div className="box">
        <CgProfile className="profile" />
        <div className="box2">
          <p>{information.description}</p>

          <p>
            {information.today} at {information.timeFo}
          </p>
        </div>
      </div>
      <button type="button" onClick={deleteSelectedOne} className="edit">
        <MdEdit />
      </button>
    </div>
  )
}

export default DateIs
