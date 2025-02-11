import emailjs from "@emailjs/browser";

const sendEmailStatus = async ({ email, name, status, formName, reason }) => {
  const templateId =
    status === "approved" ? "template_xnwj1b9" : "template_c3x4pok";

  try {
    const templateParams = {
      to_email: email,
      user_name: name,
      type_form: formName,
      rejection_reason: reason || "",
    };
    const response = await emailjs.send(
      "service_pvixkuo",
      templateId,
      templateParams,
      {
        publicKey: "5XnCSb5NlVoqin00i",
      }
    );
    console.log("Email successfully sent!", response.status, response.text);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email:" + email);
  }
};

export { sendEmailStatus };
