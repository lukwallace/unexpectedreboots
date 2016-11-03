class GroupPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      groups: [],
      allGroups: [],
    };
  }

  
  fetchGroups() {
    var context = this;
    //first fetch user groups
    fetch(SERVER_IP + ':3000/test/users/groups', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: getUsername()})
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(value) {
      context.setState({
        groups: value
      });
    });

    //then get all groups
    fetch(SERVER_IP + ':3000/test/groups/all', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(value) {
      context.setState({
        allGroups: value.filter(function(group) {
          return context.state.groups.indexOf(group) === -1;
        });
      });
    });

  }

  toggleDropdownCb(event) {
    $(event.target).closest('.dropdown').toggleClass('open');
  }

  joinGroupCb(event) {
    const groupIndex = $(event.target).closest('li').index();
    this.joinGroupAjax(this.state.allGroups[groupIndex].id);
  }

  joinGroupAjax(groupID) {
    var context = this;
    $.ajax({
      url: SERVER_IP + ':3000/api/groups/join',
      method: 'POST',
      data: {
        groupID: groupID,
        username: getUsername() 
      }
    }).done( (data) => {
      console.log('join group data', data);
      if(data === true) {
        context.fetchGroups();
      }
    }).fail( (err) => {
      console.log('join group err', err);
    });
  }


  handleGroupCreation() {
    var context = this;

    $(document).ready(function() {

      $('.group').click(function() {
        $.ajax({
          url: SERVER_IP + ':3000/test/groups/create',
          method: 'POST',
          data: {
            groupName: $('.groupName').val(),
            owner: getUsername() 
          },
          success: function(data) {
            if (data === true) {
            //get rid of the modal
              askGroup.close();
            //rerender the GroupPanel controller
              context.fetchGroups();
            } else {
            //get rid of the modal
              askGroup.close();
            //show a 'duplicate group modal'
              failGroup.open();
            } 
          }
        });
        return false;
      });
    });
  }

  
  componentDidMount() {
    this.fetchGroups();
    this.handleGroupCreation();
  }

  render() {
  

    return (
      <div>
        <AddGroup/>
        <JoinGroup allGroups={this.state.allGroups} toggleDropdownCb={this.toggleDropdownCb} joinGroupCb={this.joinGroupCb.bind(this)}/>
        { this.state.groups.filter((group) => {
          return (group.userid === group.groupowner);
        }).map((group) => {
          return (
            <div key={group.groupID}>
              <Group group={group} changeViewCb={this.props.changeViewCb} />
            </div>
        ); }) }

        { this.state.groups.filter((group) => {
          return (group.userid !== group.groupowner);
        }).map((group) => {
          return (
            <div key={group.groupID}>
              <Group group={group} changeViewCb={this.props.changeViewCb} />
            </div>
        ); }) }
      </div>
    );
  }
}


window.GroupPanel = GroupPanel;