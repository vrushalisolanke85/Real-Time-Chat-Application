const users=[]

//addUser, removeUser, getUser, getUserInRooms

const addUser=({id,username,room})=>{
    //clean data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()


    //validate the data
    if(!username || !room){
        return{
            error:'username and room are required!!'
        }
    }

    //check for existing user
    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })

    //Validate Username
    if(existingUser){
        return{
            error:'Username is in use!!'
        }
    }


    //store user
    const user={id,username,room}
    users.push(user)
    return {user}
}
//checking addUser function
// addUser({
//     id:1,
//     username:'Vrushali',
//     room:'Pune'
// })
// addUser({
//     id:2,
//     username:'Keshav',
//     room:'Pune'
// })
// addUser({
//     id:3,
//     username:'Vrushali',
//     room:'Katraj'
// })

// console.log(users)


//Removing the user by id
const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)

    //splice-remove element by their index
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

// const removedUser=removeUser(1)
// console.log(removedUser)
// console.log(users)


//getUsers
const getUser=(id)=>{
    return users.find((user)=>user.id===id)
}

console.log(getUser(2))



//getUsers in Rooms
const getUserInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)
}

const userList=getUserInRoom('Pune')
console.log(userList)

module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}