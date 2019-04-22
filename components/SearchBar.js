import React from 'react'
import Select from 'react-select'
import DropdownFilter from './DropdownFilter'
import posed from 'react-pose'
import { CLUBS_GREY, CLUBS_GREY_LIGHT } from '../colors'

const Pop = posed.div({
  idle: { scale: 1 },
  hovered: { scale: 1.1 },
})

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tagSelected: [],
      sizeSelected: [],
      applicationSelected: [],
      sizeOptions: [
        { value: 1, label: 'less than 20 members' },
        { value: 2, label: '20 to 50 members' },
        { value: 3, label: '50 to 100 members' },
        { value: 4, label: 'more than 100'}
      ],
      tagOptions: props.tags.map((tag) => ({value: tag.id, label: tag.name})),
      applicationOptions: [
        {value: 1, label: "Requires application"},
        {value: 2, label: "Does not require application"},
        {value: 3, label: "Currently accepting applications"}],
      clubs: props.clubs,
      hoverList: false,
      hoverCard: false,
      hoverDown: false,
    }
  }

  updateClubs() {

  }

  render() {
    console.log(this.state)
    const { sizes, tags, names, nameOptions, tagOptions, sizeOptions, applicationOptions, tagSelected, sizeSelected, applicationSelected } = this.state
    const { switchDisplay } = this.props
    return (
      <div style={{height: "100vh", width: "100%", overflow: "hidden", position: "sticky", top: -20}}>
        <div
          style={{
            position: "absolute",
            height: "100vh",
            width: "100%",
            right: -17,
            padding: "35px 0",
            overflowY: "scroll",
            overflowX: "hidden",
            marginBottom: "8rem"
          }}>
          <div className="is-flex" style={{justifyContent: "space-between", padding: "0 3px"}}>
            <b style={{color: CLUBS_GREY}}>View: </b>
            <div className="is-flex">
              <Pop
                pose={this.state.hoverCard ? "hovered" : "idle"}
                onMouseEnter={() => this.setState({ hoverCard: true })}
                onMouseLeave={() => this.setState({ hoverCard: false })}>
                <span className="icon" style={{cursor: "pointer", color: CLUBS_GREY}} onClick={(e)=>switchDisplay("cards")}>
                  <i class="fas fa-th-large"></i>
                </span>
              </Pop>
              <Pop
                pose={this.state.hoverList ? "hovered" : "idle"}
                onMouseEnter={() => this.setState({ hoverList: true })}
                onMouseLeave={() => this.setState({ hoverList: false })}>
                <span className="icon" >
                  <i class="fas fa-list" style={{cursor: "pointer", color: CLUBS_GREY}} onClick={(e)=>switchDisplay("list")}></i>
                </span>
              </Pop>
            </div>
          </div>
          <div style={{margin: "30px 0"}}>
            <hr style={{backgroundColor: CLUBS_GREY, height:"2px", margin: 0, padding: 0}}/>
            <div style={{display: "flex", justifyContent: "space-between", padding: "7px 3px"}}>
              <input
                type="text"
                name="search"
                placeholder="Search"
                style={{
                  borderWidth: 0,
                  outline: "none",
                  color: CLUBS_GREY,
                  width: "100%",
                  fontSize: "1em",
                }}/>
              <span className="icon" style={{cursor: "pointer", color: CLUBS_GREY}}>
                <i class="fas fa-search"></i>
              </span>
            </div>
          </div>
          <DropdownFilter
            name="Type"
            options={tagOptions}
            selected={tagSelected}
            update={(tagSelected) => this.setState({ tagSelected })}
          />
          <DropdownFilter
            name="Size"
            options={sizeOptions}
            selected={sizeSelected}
            update={(sizeSelected) => this.setState({ sizeSelected })}
          />
          <DropdownFilter
            name="Application"
            options={applicationOptions}
            selected={applicationSelected}
            update={(applicationSelected) => this.setState({ applicationSelected })}
          />
        </div>
      </div>
    )
  }
}

export default SearchBar;