require("dotenv").config();
let nodemailer = require("nodemailer");
let cors = require("cors");
const express = require("express");
const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", (req, res) => {
  const { email } = req.body;
  console.log(email);

  const mailOptions = {
    from: "mukulkolpe45@gmail.com",
    to: email,
    subject: "[SkillSphere] Welcome to Your Private Professional Identity",
    html: `
    <p><b>Welcome to SkillSphere! 🌟</b></p>
    <p>You've been invited by a recruiter to join SkillSphere - where you can showcase your professional expertise while maintaining your privacy.</p>
    <p><b>Next Steps:</b></p>
    <ol>
      <li>Connect your Web3 wallet or social accounts for secure authentication</li>
      <li>Complete your individual registration</li>
      <li>Verify your credentials through our trusted platforms:
        <ul>
          <li>GitHub - Validate your development experience and contributions</li>
          <li>LinkedIn - Confirm your professional history and connections</li>
        </ul>
      </li>
    </ol>
    <p>At SkillSphere, we believe in <i>Showcase Your Skills, Protect Your Identity</i>.</p>
    <br>
    <p>Best regards,</p>
    <p>Team SkillSphere</p>
    `,
  };

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mukulkolpe45@gmail.com",
      pass: process.env.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
});

app.post("/verification-success", (req, res) => {
  const { email } = req.body;
  console.log(email);

  const mailOptions = {
    from: "mukulkolpe45@gmail.com",
    to: email,
    subject: "[SkillSphere] Profile Verification Complete",
    html: `
    <p><b>Congratulations! Your SkillSphere Profile is Verified ✅</b></p>
    <p>Your credentials have been successfully verified through our secure verification process. Your professional identity is now protected and ready to showcase.</p>
    <p><b>Verified Credentials:</b></p>
    <ul>
      <li>✅ GitHub Profile
        <ul>
          <li>Development history</li>
          <li>Code contributions</li>
          <li>Project involvement</li>
        </ul>
      </li>
      <li>✅ LinkedIn Profile
        <ul>
          <li>Work experience</li>
          <li>Professional achievements</li>
          <li>Skills endorsements</li>
        </ul>
      </li>
    </ul>
    <p><b>What's Next:</b></p>
    <ul>
      <li>Explore job opportunities while maintaining your privacy</li>
      <li>Connect with recruiters through our secure channels</li>
      <li>Manage your verified credentials in your dashboard</li>
    </ul>
    <p>Remember: Your privacy is our priority.</p>
    <br>
    <p>Best regards,</p>
    <p>Team SkillSphere</p>
    `,
  };

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mukulkolpe45@gmail.com",
      pass: process.env.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
});

app.post("/credential-link", (req, res) => {
  const { email, githubLink, linkedinLink } = req.body;
  console.log(email + "verification");

  const mailOptions = {
    from: "mukulkolpe45@gmail.com",
    to: email,
    subject: `[SkillSphere] Complete Your Profile Verification`,
    html: `
    <p><b>Complete Your Professional Credential Verification 🔐</b></p>
    <p>Follow these links to verify your professional profiles through our secure protocol:</p>
    
    <div style="margin: 20px 0;">
      <p><b>1. Verify GitHub Profile:</b></p>
      <a href=${githubLink} style="display: inline-block; padding: 10px 20px; background-color: #2da44e; color: white; text-decoration: none; border-radius: 6px;">Verify GitHub</a>
      <p style="margin-top: 10px; font-size: 14px;">This will verify:
        <ul>
          <li>Repository contributions</li>
          <li>Coding activity</li>
          <li>Project history</li>
        </ul>
      </p>
    </div>

    <div style="margin: 20px 0;">
      <p><b>2. Verify LinkedIn Profile:</b></p>
      <a href=${linkedinLink} style="display: inline-block; padding: 10px 20px; background-color: #0a66c2; color: white; text-decoration: none; border-radius: 6px;">Verify LinkedIn</a>
      <p style="margin-top: 10px; font-size: 14px;">This will verify:
        <ul>
          <li>Professional experience</li>
          <li>Skills and endorsements</li>
          <li>Educational background</li>
        </ul>
      </p>
    </div>

    <p><b>Why verify both?</b></p>
    <ul>
      <li>Provide comprehensive proof of your technical and professional experience</li>
      <li>Increase credibility with verified credentials</li>
      <li>Enable privacy-preserved skill showcasing</li>
    </ul>
    <p>Your privacy and security are our top priorities.</p>
    <br>
    <p>Best regards,</p>
    <p>Team SkillSphere</p>
    `,
  };

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mukulkolpe45@gmail.com",
      pass: process.env.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
});

app.post("/recruiter-invite", (req, res) => {
  const { email } = req.body;
  console.log(email + "recruiter");

  const mailOptions = {
    from: "mukulkolpe45@gmail.com",
    to: email,
    subject: `[SkillSphere] You've Been Invited by a Recruiter`,
    html: `
    <p><b>Empowering Verified Talent to Connect with Top Recruiters! ✨ Your Pathway to Professional Growth Starts Here. 🚀</b></p>
    <p>A recruiter has invited you to join SkillSphere, where you can:</p>
    <ul>
      <li>Showcase your skills while maintaining privacy</li>
      <li>Verify your professional credentials securely</li>
      <li>Connect with opportunities without compromising identity</li>
    </ul>
    <p><b>Get Started in 4 Simple Steps:</b></p>
    <ol>
      <li>Visit <b>SkillSphere</b> - https://protostars.vercel.app/ platform</li>
      <li>Connect your Web3 wallet or social accounts</li>
      <li>Complete your profile registration</li>
      <li>Verify your credentials:
        <ul>
          <li><b>GitHub</b> - Showcase your technical expertise</li>
          <li><b>LinkedIn</b> - Validate your professional experience</li>
        </ul>
      </li>
    </ol>
    <p><i>SkillSphere: Showcase Your Skills, Protect Your Identity</i></p>
    <br>
    <p>Best regards,</p>
    <p>Team SkillSphere</p>
    `,
  };

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mukulkolpe45@gmail.com",
      pass: process.env.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
});

async function main() {
  app.listen(5002, console.log(`Server started at port 5002`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
