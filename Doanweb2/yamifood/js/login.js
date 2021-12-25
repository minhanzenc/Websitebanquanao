document.getElementById('username').value = localStorage.getItem('username')
document.getElementById('password').value = localStorage.getItem('password')
localStorage.clear()
var formLogin = document.getElementById('formLogin')
formLogin.addEventListener("submit", async(e) => {
    e.preventDefault()
    try {
        const formData = new FormData(formLogin)
        let values = Object.fromEntries(formData.entries())
        values = {...values,grant_type: "password"}
        console.log(values)
        const config = {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(values)
        }
        const res = await fetch('http://127.0.0.1:8000/o/token/',config)
        if(res.status === 200){
            const data = await res.json()
            console.log(data)
            localStorage.setItem('access_token',data.access_token)
            alert('dang nhap thanh cong !!')
            location.href = 'index.html'
        }
        else{
            alert("đăng nhập thất bại !!")
        }

    } catch (error) {
        alert("đăng nhập thất bại !!")
    }
   
})