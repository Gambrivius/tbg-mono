export default function handleResponse(state, data) {
    console.log("Reponse handler data:")
    console.log(data);
    let return_state = state
    if ("console" in data) {
        const message = data["console"]
        const new_msg_id = data["guid"] || "normal"
        const style = data["style"]
        const timestamp =  data["timestamp"]
        const output_stream = state.console_messages;

        output_stream.push({
            id: new_msg_id,
            style: style,
            message: message,
        })
        return_state.output_contents = output_stream
    }
   
    if ("player_data" in data) {
        const player_data = data["player_data"]
        
        return_state.player_data = player_data
    } 
    if ("room_data" in data) {
        const room_data = data["room_data"]
        
        // this is a small hack to keep the players name from showing up in the room list.  It's a given that they are there.
        let n = room_data.inhabitants.indexOf(return_state.player_data.name);
        if (n>=0) {
            room_data.inhabitants.splice(n,1);
        }
        return_state.room_data = room_data
    } 
    return return_state;
}
