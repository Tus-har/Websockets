$(document).ready(function() {

    const Username = window.prompt("Enter Username") || `New User ${Math.floor(Math.random()*1000)}` ;
    $('#userName').html("UserName : " + Username);
    const socket = io('localhost:5000',{ query : { username : Username} });

    const btn = $('#btn');
    const broadcast = $('#broadcast');
    const users = $("#users");

    btn.click(function () {
        let val = $('#msg').val();
        socket.emit('broadcastMessage', val);
    });  // to send Global msg


    // users.find(':input:submit').each( function () {
    //   $(this).click(function () {
    //       console.log("hi there");
    //       //socket.emit('Pmsg', { id , msg })
    //   });
    // });
    //let P2Pbuttons = users.find(':input:submit') ;

    users.on("click", "input:submit", function () {
        const receiver = $(this)[0].id ;
        const msg = document.getElementById(`pmsg${this.id}`).value ;
        socket.emit('PtoP',JSON.stringify({receiver , msg , Username}));
    });

    socket.on('globalChat', function (data) {
        const res = `<p>` + data+ `</p>`;
        broadcast.append(res);
        broadcast.scrollTop(broadcast[0].scrollHeight);
    }); // to receive global msg

    socket.on('UpdateUser', function (data) {
        users.empty();
        for (const e of data) {
            const res = `<div> ` + e.username + `<input type='text' id="pmsg${e.socketID}" name="msg">` +
                `<input type='submit' id=${e.socketID}>` + `</div>`;
            if (e.socketID !== socket.id)
                users.append(res);
        }
    });  // to display active users

    socket.on('Pmsg', function (data) {
        console.log(data);
        const { msg , Username } = JSON.parse(data);
        const res = `<p>` + Username +" : "+ msg + `</p>`;
        $('#personel').append(res);
    });

    socket.on('destroy',function () {
        location.reload();
    })

});
