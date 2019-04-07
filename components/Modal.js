import React from 'react'

class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: '',
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if (this.props !== prevProps) {
      var { modal } = this.props
      this.setState({ modal })
    }
  }

  randomClub() {
    const clubs = ["https://files.slack.com/files-pri/T4EM1119V-FH9E8PE93/images.jpeg",
    "http://static.asiawebdirect.com/m/kl/portals/kuala-lumpur-ws/homepage/magazine/5-clubs/pagePropertiesImage/best-clubs-kuala-lumpur.jpg.jpg",
    "https://files.slack.com/files-pri/T4EM1119V-FHA7CVCNT/image.png",
    "https://files.slack.com/files-pri/T4EM1119V-FH920P727/image.png",
    "https://files.slack.com/files-pri/T4EM1119V-FH958BEAW/image.png",
    "https://files.slack.com/files-pri/T4EM1119V-FH6NHNE0Y/seltzer.jpg",
    "https://s3.envato.com/files/990f2541-adb3-497d-a92e-78e03ab34d9d/inline_image_preview.jpg"
    ]
    const i = Math.floor(Math.random() * (6));
    return clubs[i];
  }

  render() {

    var { modal, club, isFavorite, toggleFavorite, closeModal } = this.props
    console.log(club)
    return(
      <div className={"modal" + modal} style={{position: "fixed", top: 0, height: "100%", width: "100%"}}>
        <div className="modal-background" style={{backgroundColor: "#d5d5d5", opacity: .5}}></div>
        <div className="card" style={{ margin: "6rem", padding: 10, borderRadius: 5, borderWidth: 1, boxShadow: "0px 2px 6px grey" }}>
          <span className="icon" onClick={(e)=>closeModal(club)} style={{float:"right"}}>
            <i className="fas fa-times"></i>
          </span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 30px"}}>
            <b className="is-size-1"> {club.name} </b>
            <span className="icon" onClick={(e)=>toggleFavorite(club)} style={{float:"right", padding: "10px 10px 10px 0px"}}>
              <i className={(isFavorite(club) ? "fas" : "far") + " fa-heart fa-2x"} ></i>
            </span>
          </div>
          <div className="columns" style={{ padding: 10 }}>
            <div className="column">
              <img style={{ height: 400 }} src={club.img ? club.img : this.randomClub()} />
            </div>
            <div className="column">
              <p className="is-size-5">{club.description}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Modal