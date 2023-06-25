import {Component} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {format} from 'date-fns'
import {v4 as uuidv4} from 'uuid'
import {MdDelete} from 'react-icons/md'
import DateIs from './components/DateIs'

import './App.css'

class App extends Component {
  state = {
    status: true,
    task: [],
    today: new Date(),
    description: '',
    apiDetails: [],
    edit: false,
    id: '',
    time: '',
  }

  componentDidMount() {
    this.getAccess()
  }

  updateStatus = () => {
    this.setState(prevState => ({
      status: !prevState.status,
      edit: false,
      description: '',
      today: new Date(),
      time: '',
      id: '',
    }))
  }

  updateDes = event => {
    this.setState({description: event.target.value})
  }

  updateDate = event => {
    this.setState({today: event})
  }

  updateTime = event => {
    this.setState({time: event.target.value})
  }

  updateData = () => {
    const {id, description, today, task, time} = this.state
    let ti
    if (parseInt(time.split(':')[0]) > 12) {
      ti = `${parseInt(time.split(':')[0]) - 12}:${time.split(':')[1]}pm`
    } else {
      ti = `${time}am`
    }
    if (id !== '') {
      this.setState(prevState => ({
        task: prevState.task.map(each => {
          if (id === each.id) {
            return {
              ...each,
              description,
              today: format(today, 'MM/dd/yyyy'),
              timeFo: ti,
            }
          }
          return each
        }),
        edit: false,
        status: !prevState.status,
        description: '',
        today: new Date(),
        time: '',
      }))
    } else {
      const details = {
        description,
        today: format(today, 'MM/dd/yyyy'),
        id: uuidv4(),
        timeFo: ti,
        time,
      }
      task.push(details)
      this.setState(prevState => ({
        task,
        status: !prevState.status,
        description: '',
        today: new Date(),
        time: '',
        edit: false,
      }))
    }
  }

  getAccess = async () => {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'smithwills1989@gmail.com',
        password: '12345678',
      }),
    }
    const url = 'https://stage.api.sloovi.com/login?product=outreach'
    const response = await fetch(url, options)
    const data = await response.json()
    const detail = {
      userId: data.results.user_id,
      companyId: data.results.company_id,
      token: data.results.token,
    }
    this.setState({apiDetails: detail})
    this.getUserDetails()
  }

  getUserDetails = async () => {
    const {apiDetails} = this.state
    const {token, companyId, userId} = apiDetails
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const url = `https://stage.api.sloovi.com/team?product=outreach&company_id=${companyId}`
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
  }

  selectDelete = id => {
    const {task} = this.state
    const filter = task.filter(each => each.id === id)

    this.setState(prevState => ({
      id,
      edit: !prevState.edit,
      description: filter[0].description,
      today: new Date(filter[0].today),
      status: !prevState.status,
      time: filter[0].time,
    }))
  }

  deleteList = () => {
    const {id, task} = this.state
    const filter = task.filter(each => each.id !== id)
    this.setState(prevState => ({
      task: filter,
      edit: false,
      status: !prevState.status,
      description: '',
      today: new Date(),
      time: '',
    }))
  }

  render() {
    const {status, task, today, description, edit, time} = this.state

    return (
      <div className="main-cont">
        <div className="content-cont">
          <div className="task-row">
            <p>Tasks {task.length}</p>

            <button type="button" onClick={this.updateStatus}>
              +
            </button>
          </div>

          <>
            {status ? null : (
              <div className="info-cont">
                <p>Task Description</p>
                <input
                  type="text"
                  value={description}
                  onChange={this.updateDes}
                />
                <br />
                <div className="date-cont">
                  <div>
                    <p>Date</p>
                    <DatePicker selected={today} onChange={this.updateDate} />
                  </div>
                  <div>
                    <p>Time</p>
                    <input
                      type="time"
                      id="time"
                      value={time}
                      onChange={this.updateTime}
                    />
                  </div>
                </div>
                <div className="button">
                  <div>
                    {edit ? (
                      <button
                        type="button"
                        onClick={this.deleteList}
                        className="delete"
                      >
                        <MdDelete />
                      </button>
                    ) : null}
                  </div>
                  <div className="left">
                    <button
                      type="button"
                      onClick={this.updateStatus}
                      className="cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={this.updateData}
                      className="save"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            {task.length > 0 ? (
              <div>
                {task.map(each => (
                  <DateIs
                    key={each.id}
                    information={each}
                    deleteSelect={this.selectDelete}
                  />
                ))}
              </div>
            ) : null}
          </>
        </div>
      </div>
    )
  }
}

export default App
