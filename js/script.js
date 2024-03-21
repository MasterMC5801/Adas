/* Open link in new tab */
const link = 'contact.html';

/*Mobile navbar (open, close)*/
const navbar = document.querySelector('.navbar');
const navbarLinks = document.querySelector('.links');
const hamburger = document.querySelector('.hamburger');

const config = {
  serverInfo: {
    serverLogoImageFileName:
      'logo.png' /*This is a file name for logo in /images/ (If you upload new logo with other name, you must change this value)*/,
    siteName: 'ADAS Haus' /*Server name*/,
    serverIp:
      'Gestalten Sie Ihre Wel' /*Server IP (if you want to add online user counter, you must have true the enable-status and enable-query of server.properties)*/
  },

  userSKinTypeInAdminTeam:
    'bust' /*[full, bust, head, face, front, frontFull, skin]*/
  /*
    Contact form
    ------------
    To activate, you need to send the first email via the contact form and confirm it in the email.
    Emails are sent via https://formsubmit.co/
    */
};

/* Open link in new tab */
function openLink(link) {
  window.open(link, '_blank');
}

hamburger.addEventListener('click', () => {
  navbar.classList.toggle('active');
  navbarLinks.classList.toggle('active');
});

/* Form email */
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const nameInput = document.querySelector('#name');
  const emailInput = document.querySelector('#email');
  const phoneInput = document.querySelector('#phone');
  const messageInput = document.querySelector('#message');
  const submitButton = document.querySelector("input[type='submit']");

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Validazione dei campi
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    if (name === '') {
      alert('Il campo Nome è obbligatorio');
      return;
    }

    if (email === '') {
      alert('Il campo Email è obbligatorio');
      return;
    }

    if (phone === '') {
      alert('Il campo Numero di Telefono è obbligatorio');
      return;
    }

    if (message === '') {
      alert('Il campo Messaggio è obbligatorio');
      return;
    }

    // Invio del modulo
    form.submit();
  });
});

/*FAQs*/
const accordionItemHeaders = document.querySelectorAll(
  '.accordion-item-header'
);

accordionItemHeaders.forEach((accordionItemHeader) => {
  accordionItemHeader.addEventListener('click', () => {
    accordionItemHeader.classList.toggle('active');
    const accordionItemBody = accordionItemHeader.nextElementSibling;

    if (accordionItemHeader.classList.contains('active'))
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + 'px';
    else accordionItemBody.style.maxHeight = '0px';
  });
});

/*Config navbar*/
const siteName = document.querySelector('.server-name');
const serverLogo = document.querySelector('.logo-img');
/*Config header*/
const serverLogoHeader = document.querySelector('.logo-img-header');
const minecraftOnlinePlayers = document.querySelector(
  '.minecraft-online-players'
);
/*Config contact*/
const contactForm = document.querySelector('.contact-form');
const inputWithLocationAfterSubmit = document.querySelector(
  '.location-after-submit'
);

const getSkinByUuid = async (username) => {
  try {
    const skinByUuidApi = `https://visage.surgeplay.com/${
      config.userSKinTypeInAdminTeam
    }/512/${await getUuidByUsername(username)}`;
    let response = await fetch(skinByUuidApi);

    if (response.status === 400)
      return `https://visage.surgeplay.com/${config.userSKinTypeInAdminTeam}/512/ec561538f3fd461daff5086b22154bce`;
    else return skinByUuidApi;
  } catch (e) {
    console.log(e);
    return 'None';
  }
};

/*IP copy only works if you have HTTPS on your website*/

const setDataFromConfigToHtml = async () => {
  /*Set config data to navbar*/
  siteName.innerHTML = config.serverInfo.siteName;
  serverLogo.src = `images/` + config.serverInfo.serverLogoImageFileName;

  let locationPathname = location.pathname;

  if (locationPathname == '/' || locationPathname.includes('index')) {
    /*Set config data to header*/
    serverLogoHeader.src =
      `images/` + config.serverInfo.serverLogoImageFileName;
  } else if (locationPathname.includes('rules')) {
  } else if (locationPathname.includes('admin-team')) {
    for (let team in config.adminTeamPage) {
      const atContent = document.querySelector('.at-content');

      const group = document.createElement('div');
      group.classList.add('group');
      group.classList.add(team);

      const groupSchema = `
                <h2 class="rank-title">${
                  team.charAt(0).toUpperCase() + team.slice(1)
                }</h2>
                <div class="users">
                </div>
            `;

      group.innerHTML = groupSchema;

      atContent.appendChild(group);

      for (let j = 0; j < config.adminTeamPage[team].length; j++) {
        let user = config.adminTeamPage[team][j];
        const group = document.querySelector('.' + team + ' .users');

        const userDiv = document.createElement('div');
        userDiv.classList.add('user');

        let userSkin = config.adminTeamPage[team][j].skinUrlOrPathToFile;

        if (userSkin == '') userSkin = await getSkinByUuid(user.inGameName);
        let rankColor = config.atGroupsDefaultColors[team];

        if (user.rankColor != '') {
          rankColor = user.rankColor;
        }

        const userDivSchema = `
                    <img src="${await userSkin}" alt="${user.inGameName}">
                    <h5 class="name">${user.inGameName}</h5>
                    <p class="rank ${team}" style="background: ${rankColor}">${
          user.rank
        }</p>  
                `;

        userDiv.innerHTML = userDivSchema;
        group.appendChild(userDiv);
      }
    }
  } else if (locationPathname.includes('contact')) {
    contactForm.action = `https://formsubmit.co/${config.contactPage.email}`;
    inputWithLocationAfterSubmit.value = location.href;
  }
};

setDataFromConfigToHtml();
