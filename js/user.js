let user;

function UserData({name, img, gender, age, height, weight, targetWeight, fat, targetFat, skeletal, targetSkeletal, bmr}) {
    this.name = name;
    this.img = img;
    this.gender = gender;
    this.age = age;
    this.height = height;
    this.weight = weight;
    this.targetWeight = targetWeight;
    this.fat = fat;
    this.targetFat = targetFat;
    this.skeletal = skeletal;
    this.targetSkeletal = targetSkeletal;
    this.bmr = bmr;

    this.get = () => {
        return JSON.stringify({
            name: this.name,
            img: this.img,
            gender: this.gender,
            age: this.age,
            height: this.height,
            weight: this.weight,
            targetWeight: this.targetWeight,
            fat: this.fat,
            targetFat: this.targetFat,
            skeletal: this.skeletal,
            targetSkeletal: this.targetSkeletal,
            bmr: this.bmr,
        });
    }
    this.set = (string, value) => {
        this[string] = value;
    }
}
const calcDate = () => {
    const startDate = new Date(document.querySelector("#start-date").value);
    const today = new Date();
    const diff = Math.abs(today.getTime() - startDate.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    const target = document.querySelector("#date-diff");
    target.innerHTML = String(days);
}
const getBMI = () => {
    const under = (user.height / 100) ** 2;

    const targetBMI = (user.targetWeight / under) - 16;
    const currentBMI = (user.weight / under) - 16;

    return {
        target : (targetBMI * 100 / 21.5).toFixed(1),
        current : (currentBMI * 100 / 21.5).toFixed(1)
    }
}
const getFat = () => {
    return {
        current : (user.fat * 100 / 40).toFixed(1),
        target : (user.targetFat * 100 / 40).toFixed(1),
    }
}
const getSkeletal = () => {
    return {
        target : ((user.targetSkeletal - user.targetWeight * 0.4) * 100 / (user.targetWeight * 0.1)).toFixed(1),
        current : ((user.skeletal - user.weight * 0.4) * 100 / (user.weight * 0.1)).toFixed(1),
    }
}
const setGraph = () => {
    const bmi = getBMI();
    const fat = getFat();
    const skeletal = getSkeletal();

    const set = (values, string) => {
        const animate = (doc, val) => {
            const getFinalValue = (float) => {
                let n = Math.round(float * 10);
                if (n % 2 !== 0) n += 1;
                return n / 10;
            }

            let value = (doc.value) ? Number(Number(doc.value).toFixed(1)) : 0;
            const finalValue = getFinalValue(val).toFixed(1);

            const animation = setInterval(() => {
                doc.value = value;
                if (value > finalValue) {
                    value = (value * 10 - 2) / 10;
                } else if (value < finalValue) {
                    value = (value * 10 + 2) / 10;
                } else {
                    clearInterval(animation);
                }
            }, 1);
        }

        const graphs = Array.from(document.querySelectorAll('.graph-progress'));
        const targetGraph = graphs.find(g => g.id === `${string}-target`);
        const currentGraph = graphs.find(g => g.id === `${string}-current`);

        animate(targetGraph, values.target);
        animate(currentGraph, values.current);

        const currentNumber = document.querySelector(`#${string}-current-number`);
        const targetNumber = document.querySelector(`#${string}-target-number`);

        if (string === "skeletal") {
            currentNumber.innerHTML = String((user.skeletal * 100 / user.weight).toFixed(1)) + "%";
            targetNumber.innerHTML = String((user.targetSkeletal * 100 / user.targetWeight).toFixed(1)) + "%";
        } else {
            const upStr = string.charAt(0).toUpperCase() + string.slice(1);
            currentNumber.innerHTML = user[string] + ((string === "weight") ? "kg" : "%");
            targetNumber.innerHTML = user["target" + upStr] + ((string === "weight") ? "kg" : "%");
        }
    }

    set(bmi, "weight");
    set(fat, "fat");
    set(skeletal, "skeletal");
}
const calcBMR = () => {
    const bmr = (user.gender === "male")
        ? 6647 + (1375 * user.weight) + (500 * user.height) - (676 * user.age)
        : 65510 + (956 * user.weight) + (185 * user.height) - (468 * user.age);
    const bmrArr = String(bmr / 100).split(".");

    const spanA = document.createElement("span");
    spanA.className = "bmr-main";
    spanA.innerText = bmrArr[0];

    const spanB = document.createElement("span");
    spanB.className = "bmr-sub";
    spanB.innerText = "." + bmrArr[1];

    const target = document.querySelector("#bmr");
    target.replaceChildren(spanA, spanB);

    user.set("bmr", bmr / 100);
}
const onChange = (ev) => {
    let strings = ev.target.id.split("-");
    strings = strings.map((str, i) => {
        if (i === 0) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    });
    const string = strings.join("");
    user.set(string, Number(ev.target.value));
    console.log(string);

    calcBMR();
    setGraph();
}
const onSubmit = (ev) => {
    ev.preventDefault();

    localStorage.setItem("user", user.get());

    const button = document.querySelector("#save");
    button.innerHTML = "<i class=\"fa-solid fa-check\"></i> 저장되었습니다!";
    button.disabled = true;
    setTimeout(() => {
        button.innerText = "저장";
        button.disabled = false;
    }, 1000);
}
const init = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || !loggedInUser.length === 0) {
        window.alert("로그인하십시오.");
        window.location.replace("login.html");
    }
    const defData = {
        name: loggedInUser.nickname,
        img: "resources/images/male.jpg",
        gender: "male",
        age: 28,
        height: 182,
        weight: 90,
        targetWeight: 65.5,
        fat: 25,
        targetFat: 11.2,
        skeletal: 38.4,
        targetSkeletal: 32,
        bmr: 2024.69
    }
    user = new UserData(JSON.parse(localStorage.getItem("user")) ?? defData);
    if (user.length === 0 || !user.name) user = new UserData(defData);
    user.set("name", loggedInUser.nickname);
    const {get, set, ...etc} = user;
    for (let prop in etc) {
        if (etc[prop]) continue;
        user.set(prop, defData[prop]);
        etc[prop] = defData[prop];
    }

    const {name, img, gender, bmr, ...data} = etc;

    const input = document.querySelector(`input[name="gender"][value="${gender}"]`);
    input.checked = true;

    for (let prop in data) {
        let chars = prop.split("");
        chars = chars.map(c => {
            if (c === c.toUpperCase()) c = "-" + c.toLowerCase();
            return c;
        });
        const string = chars.join("");
        const input = document.querySelector(`input#${string}`);
        input.value = data[prop] ?? 0;
    }

    const title = document.querySelector("#welcome-name");
    title.innerHTML = name;

    const nickname = document.querySelector("#name");
    nickname.innerHTML = name;

    const image = document.querySelector("#user-image");
    image.src = img;

    const form = document.querySelector("#user-inputs");
    form.onsubmit = (ev) => onSubmit(ev);

    const inputs = document.querySelectorAll('.user-input input');
    inputs.forEach((input) => {
        input.onchange = (ev) => onChange(ev);
    });

    const date = document.querySelector(".date");
    date.addEventListener("change", calcDate);

    const editProfile = document.querySelector("#edit-profile");
    editProfile.addEventListener("click", () => {
        const imgPath = user.img.split("/");
        let imgName = imgPath[imgPath.length - 1];
        imgName = (imgName === "male.jpg") ? "female.jpg" : "male.jpg";
        const newImage = `resources/images/${imgName}`;
        user.set("img", newImage);

        image.src = newImage;
    })

    calcDate();
    calcBMR();
    setTimeout(setGraph, 300);
}
window.addEventListener('DOMContentLoaded', init);