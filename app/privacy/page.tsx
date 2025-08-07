import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Inox Secure",
  description:
    "Learn how Inox Secure collects, uses, and protects your personal information",
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 to-transparent">
        <div className="flex flex-col items-center text-center mb-16 px-10 py-10 w-full text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Privacy policy
          </h1>
          <p className="text-lg text-white max-w-3xl">
            We are committed to protecting your privacy and ensuring the
            security of your personal information.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="prose prose-lg max-w-none">

          <section className="mb-10">
            <p>
              We, i.e., "Inoxsecure e-Commerce" (formerly known as Inoxsecure Services) ("Company"), are committed to protecting the privacy and security of your personal information. Your privacy is important to us, and maintaining your trust is paramount.
              <br />
              <br />
              This Privacy Policy explains how we collect, use, process, and disclose information about you. By using our website/app/platform and affiliated services, you consent to the terms of our Privacy Policy, in addition to our Terms of Use. We encourage you to read this Privacy Policy to understand how your information is collected, used, and disclosed from time to time. Please stay updated with any changes or updates we make to this policy.
              <br />
              <br />
              This Privacy Policy describes our privacy practices for all websites, products, and services that are linked to it. However, this policy does not apply to affiliates and partners that have their own privacy policies. In such cases, we recommend that you read the privacy policy on the applicable site.
              <br />
              <br />
              If you have any questions regarding this Privacy Policy, please write to us at <a href="mailto:privacy@inoxsecure.com" className="text-blue-600 underline">privacy@inoxsecure.com</a>.
            </p>
          </section>


          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">
              Applicability and Scope
            </h2>
            <p>
            Inoxsecure (the "Company", "we", "us", or "our") respects your privacy and is committed to protecting it. This policy explains:
              <br />
              • The types of information that Inoxsecure may collect from you directly or through automated means when you access or use its website and other online services (collectively referred to as "Services"); and
              <br />
              • Its practices for collecting, using, maintaining, protecting, and disclosing that information.
              <br />
              <br />
              This policy applies only to the information Inoxsecure collects through its Services, including email, text, and other electronic communications sent through or in connection with the Services. This policy does not apply to information you provide to, or that is collected by, any third party you use in connection with the Services. Inoxsecure encourages you to consult such third parties directly regarding their privacy practices.
              <br />
              <br />
              Please read this policy carefully to understand Inoxsecure's policies and practices regarding your information and how it will be treated. By accessing or using the Services and/or registering for an account with Inoxsecure, you agree to this privacy policy and consent to Inoxsecure's collection, use, disclosure, retention, and protection of your personal information as described here.
              <br />
              <br />
              If you do not provide the required information, Inoxsecure may not be able to offer all of its Services to you.
              <br />
              <br />
              This policy may change from time to time. Your continued use of Inoxsecure's Services after any such change will be considered your acceptance of those changes, so please review this policy periodically for updates.
              <br />
              <br />
              <strong>Permissible Age:</strong> The Services are not intended for users under the age of 18 unless allowed under applicable local laws ("Permissible Age"). We do not knowingly collect personal information from, or market to, anyone under the Permissible Age.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              1. The information we collect and how we use it
            </h3>
            <ul className="list-disc pl-6 space-y-2 my-4 text-justify">
              <li>
                The information we collect on or through our Services may include:
              </li>
              <li>
                <strong>Personal Information:</strong> Name, address, email address, postal code, password, and other account details like gender, mobile number, date of birth, anniversary date, bio, and website.
              </li>
              <li>
                <strong>Your Content:</strong> Information you share through our Services, such as order details, contact info of people you add for features, and anything you add to your profile. If you share your friends’ or others’ contact info, you confirm that you have their consent to do so.
              </li>
              <li>
                <strong>Your Searches and Activities:</strong> Search terms you used and the results you clicked on.
              </li>
              <li>
                <strong>Your Browsing Information:</strong> How long you used our Services, which features you used, and ads you clicked.
              </li>
              <li>
                <strong>Your Communications:</strong> Messages between you and delivery partners or sellers (some may be recorded). This includes surveys, contests, newsletters, customer support chats, or messages via SMS (your number, carrier, time logged). If you give feedback, we may share it with third-party sellers or providers.
              </li>
              <li>
                <strong>Your Transactional Information:</strong> When you make purchases, we store info to process your orders — like phone number, address, email, billing info, and payment details. We may share this with third parties like PCI-compliant payment gateways. Your card data is encrypted using standard security methods.
              </li>
              <li>
                <strong>Image / Video Data:</strong> We may collect images or videos from CCTV at offices, stores, or events for security purposes. These may include faces, vehicles, and other personal details. Event photos/videos may also be used for promotions and shared with business/event partners.
              </li>
            </ul>


            <h3 className="text-xl font-semibold mt-6 mb-3">
              2. Information We Collect Through Automatic Data Collection Technologies
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-justify">
              <li>
                We may automatically collect certain information about the computer or devices (including mobile devices) you use to access the Services, and about your usage, even if you're not logged in.
              </li>
              <li>
                <strong>Usage Information:</strong> Details about how you use our Services — including traffic data, location data, logs, and other communication data.
              </li>
              <li>
                <strong>Computer and Device Information:</strong> Info like your IP address, OS, platform, browser type, connection type/speed, device type, unique device ID, mobile network, and phone number.
              </li>
              <li>
                <strong>Stored Information and Files:</strong> Our app may access metadata from files stored on your device — like photos, videos, audio, contacts, etc.
              </li>
              <li>
                <strong>Location Information:</strong> We may collect real-time location data from your device if you allow it.
              </li>
              <li>
                <strong>Last URL Visited:</strong> The URL of the last webpage you visited before coming to our site.
              </li>
              <li>
                <strong>Your Preferences:</strong> Settings like time zone and language.
              </li>
              <li>
                <strong>Your Activity:</strong> Data like search queries, comments, clicked links, pages viewed (and order), time spent, and error logs.
              </li>
              <li>
                <strong>Precise Location:</strong> If you use GPS features, we may collect latitude, longitude, altitude, and timestamp to customize location-based features. This may be linked with your device ID.
              </li>
              <li>
                <strong>Cookies and Tracking Tools:</strong> Inoxsecure and our partners may use cookies, web beacons, mobile IDs, and similar tools to recognize users, store preferences, personalize content/ads, analyze usage, and for security.
              </li>
            </ul>


            <h3 className="text-xl font-semibold mt-6 mb-3">
              Information We Collect From Third Parties
            </h3>
            <ul className="list-disc pl-6 space-y-2 my-4 text-justify">
              <li>
                We may collect, process, and store your user ID associated with any social media account (such as Facebook or Google) that you use to sign in to the Services or connect with them. When you log in using a social media account or link it with our Services, you consent to our collection, storage, and use of the information available through that social media interface, as per this Privacy Policy.
                <br />
                <br />
                This may include — but is not limited to — public information on your social media account, data shared with us by the social media service, or information provided during sign-in. Please refer to your social media provider’s privacy policy and help center to learn how they handle and share your data.
              </li>
              <li>
                We may also collect information about you from third parties — such as marketing partners, third-party websites, and researchers — and combine it with the information we collect from or about you.
              </li>
            </ul>

          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">
              How we use the information we collect
            </h2>

            <p className="mb-4">
              We primarily collect your data to provide you with the Services that you opt for. Our Services are supported by a wide range of additional services that directly or indirectly enhance the experience we offer. We use the information we collect from and about you for a variety of purposes, including:

              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>To administer our Services:</strong> by sharing information with third parties that help facilitate the Services, such as delivery partners, service providers, and vendors.</li>
                <li><strong>To process and respond</strong> to your queries and complaints.</li>
                <li><strong>To understand our users:</strong> (e.g., their activities on our Services, features they like, and how they use them), improve the content and features (e.g., by personalizing content to your interests), complete transactions, and offer customized deals and services based on your preferences.</li>
                <li><strong>To diagnose technical problems,</strong> platform issues, and other necessary diagnostics for a stable and functional service.</li>
                <li><strong>To send you communications</strong> (emails, courier, registered post, calls, SMS, WhatsApp messages, or other modes) that you have requested or that may interest you. This includes customer support and grievance redressal.</li>
                <li><strong>To show you ads</strong> that are relevant to your interests.</li>
                <li><strong>To generate and review reports</strong> and conduct research on user behavior and service usage patterns.</li>
                <li><strong>To allow you to participate</strong> in interactive features like promotions, contests, and sweepstakes. We may share your data with third parties managing these activities.</li>
                <li><strong>To fulfill and enforce</strong> our obligations and rights from contracts between you and us, including enforcing terms, agreements, billing, and collections.</li>
                <li><strong>To detect and prevent fraud,</strong> abuse of promotions, and violations of our terms of service.</li>
                <li><strong>For employee training</strong> and quality assurance purposes.</li>
                <li><strong>To notify you</strong> about changes to our Services.</li>
                <li><strong>To comply</strong> with legal requirements and obligations.</li>
                <li><strong>To anonymize or de-identify</strong> information collected from you (e.g., via third-party web analytics tools). This data may be used or disclosed without restriction.</li>
                <li><strong>To contact you for marketing</strong> our own or third-party products and services that may interest you. We may use collected data to show ads to target audiences of third-party advertisers. While we do not share personal data without your consent, interacting with ads may reveal you match the advertiser's criteria.</li>
                <li><strong>Analytics and tailored advertising:</strong> We may use third-party web analytics tools (e.g., Google Analytics) to better understand your use of our Services. These tools may collect and evaluate user behavior.</li>
                <li><strong>Tailored advertising:</strong> Third parties (e.g., ad networks like Google Analytics, OpenX, Pubmatic, DoubleClick) may use cookies and similar tech to collect information about your use of our Services. This data helps deliver customized ads, measure impressions, and track user interactions. We do not control or govern the use of such tracking technologies. Tailored ads may also appear in our mobile applications.</li>
                <li><strong>For any other purpose</strong> necessary to administer the Services, with your consent.</li>
                <li><strong>Payment card information:</strong> To use specific features like transactions, we may require your credit/debit card details. By submitting this information, you agree to share it with third-party payment processors and service providers (including fraud detection services).</li>
                <li><strong>Applicants:</strong> If you apply for a job (e.g., delivery partner or in-store staff), we will use your information to evaluate your application. We may retain your data for administrative use and share it with other companies for job consideration, background checks, and with third-party providers managing recruitment. If hired or processed, we may also collect and store more information as governed by this Privacy Policy.</li>
              </ul>
            </p>


          </section>


          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">
              How We Share Your Information
            </h2>
            <p className="mb-4">
              We use personal information to provide you with the services that you have opted to receive through the use of our platform and services. For facilitation of this, we may disclose personal information that we collect, or you provide, as described in this privacy policy, in the following ways:<br /><br />

              <strong>General Information Disclosures</strong>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  <strong>To our subsidiaries and affiliates:</strong> which are entities under common ownership or control of our ultimate parent company inoxscure services.
                </li>
                <li>
                  <strong>To contractors, sellers, suppliers, advertisers/service providers:</strong> who are typically bound by contractual obligations to keep personal information confidential and use it only for the purposes for which we disclose it to them.
                </li>
                <li>
                  <strong>To an actual or potential buyer or other successor:</strong> in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of inoxsecure's assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which personal information held by inoxsecure about the users of our Services are among the assets transferred.
                </li>
                <li>
                  <strong>To third-parties, including suppliers:</strong> to market their products or services to you if you have consented to receive the promotional updates. We contractually require these third-parties to keep personal information confidential and use it only for the purposes for which we disclose it to them.
                </li>
                <li>
                  <strong>Sellers and brands:</strong> In cases where you provide us with feedback regarding the quality of products or services received by you, we may share this feedback with the relevant brand / seller or other third party as the case may be, along with your personal data, to ensure timely grievance redressal and prevent recurrence of similar issues. We may also run contests and campaigns on the platform in collaboration with or on behalf of brands. Participation in such campaigns is voluntary, and customer details may be shared with the brand to administer such events, additionally subject to their terms and conditions and privacy policy.
                </li>
                <li>
                  <strong>Service Providers:</strong> We may share your information with third-party service providers that we use for a variety of purposes, such as to send you communications via emails, messages or tele-call to inform you about our products and Services that may be of interest to you, push notifications to your mobile device on our behalf, provide voice recognition services to process your spoken queries and questions, help us analyze use of our Services, and process and collect payments. Some of our products, Services, and databases are hosted by third-party hosting services providers. We may also use third-party service providers for other projects, such as conducting surveys, organizing sweepstakes, or providing services and business/commercial solutions for us whether permanently or on an ad hoc basis. We may share information about you with these service providers to enable them to perform their services.
                </li>
                <li>
                  <strong>Legal Authorities:</strong> We may share your information when we believe in good faith that such sharing is reasonably necessary in order to investigate, prevent, or take action regarding possible illegal activities or to comply with legal processes. This may involve the sharing of your information with law enforcement, government agencies, courts, and/or other organizations on account of legal requests such as notices, summons, court orders, or government demands to comply with applicable laws.
                </li>
                <li>
                  <strong>Audit and other assurance purposes:</strong> We may also share your information to investigate and address threats or potential threats to the safety of any person, to investigate and address violations of this Privacy Policy or the Terms of Service, or to investigate and address violations of the rights of third parties and/or to protect the rights, property, and safety of inoxsecure, our employees, other users, or the public. We may also share information with internal and external audit teams and various stakeholders across our ecosystem, including affiliated entities, payment gateways, banks, and other financial entities for fraud detection, prevention, mitigation, auditing, and assurance purposes.
                </li>
                <li>
                  <strong>Exceptional circumstances:</strong> If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of inoxsecure, our customers or others, we may share limited data to the extent necessary to ensure safety of the platform. This includes exchanging information with other companies and organizations for the purposes of fraud protection and credit risk reduction.
                </li>
                <li>
                  We may additionally share your information with third parties in any other circumstances where we have your consent to do so.
                </li>
              </ul>
            </p>



            <h3 className="text-xl font-semibold mt-6 mb-3">
              Your Information
            </h3>
            <p>
              <strong>Correspondence:</strong> When you sign up for an account, you are opting to receive correspondence from other inoxsecure users and inoxsecure. You can manage your email and notification preferences and follow the "unsubscribe" instructions for commercial email messages. Note that you cannot opt out of receiving certain administrative policy, service policy, or legal policy related correspondences from inoxsecure.
              <br /><br />

              <strong>Deletion:</strong> If you would like to permanently delete your account, please use the "Contact Us" link at the bottom of every page (also located here). Once you have requested for deletion of the data associated with your account, we will not be able to restore your account or any of its associated data to you. Copies and backups of your personal information may continue to remain in our backup storage used for recovery in case of contingencies, as well as for enforcing our legal rights and fraud / risk mitigation purposes.
              <br /><br />

              <strong>Limitation:</strong> Your rights regarding your personal information may be limited, subject to the law of your jurisdiction, particularly:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>If your requests are abusive or unreasonably excessive,</li>
                <li>Where the rights or safety of another person or persons would be encroached upon, or</li>
                <li>If the information or material you request relates to existing or anticipated legal proceedings between you and us, or providing access to you would prejudice negotiations between us or an investigation of possible unlawful activity.</li>
              </ul>
              <br />
              Your right to review, update, correct, and delete your information is subject to our records retention policies and applicable law, including any statutory retention requirements.
            </p>



            <h3 className="text-xl font-semibold mt-6 mb-3">
              Security: How we protect your information
            </h3>
            <p>
              We have implemented appropriate physical, electronic, and managerial procedures to safeguard and help prevent unauthorized access to your information and to maintain data security. These safeguards take into account the sensitivity of the information that we collect, process and store and the current state of technology. We follow generally accepted industry standards to protect the personal information submitted to us, both during transmission and once we receive it. The third party service providers providing payment gateway and payment processing services are all validated as compliant with the payment card industry standard (generally referred to as PCI compliant service providers).
              We assume no liability or responsibility for disclosure of your information due to errors in transmission, unauthorized third-party access, or other causes beyond our control. You play an important role in keeping your personal information secure. You should not share your user name, password, or other security information for your inoxsecure account with anyone. If we receive instructions using your username and password, we will consider that you have authorized the instructions and will not be liable for any breach or subsequent loss arising out of such perceived authorisation.

            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Miscellaneous
            </h3>
            <p>
              <strong>Third party links and services:</strong> The Services may contain links to third-party websites. Your use of these features may result in the collection, processing or sharing of information about you, depending on the feature. Please be aware that we are not responsible for the content or privacy practices of other websites or services which may be linked to our services. We do not endorse or make any representations about third-party websites or services. Our Privacy Policy does not cover the information you choose to provide to or that is collected by these third parties. We strongly encourage you to read such third parties' privacy policies prior to sharing any personal information with such third parties.
              <br /><br />

              <strong>Policy amendments:</strong> We reserve the right to amend this Privacy Policy from time to time to reflect changes in the law, our data collection and processing practices, the features of our Services, or advances in technology. Please check this page periodically for any changes or updates. Use of information we collect is subject to the Privacy Policy in effect at the time such information is used. If we make any material changes to this Privacy Policy, we will post the changes here and may notify you where required by law. Please review the changes carefully. Your continued use of the Services following the posting of changes to this Privacy Policy will constitute your consent and acceptance of those changes.
            </p>




            <h3 className="text-xl font-semibold mt-6 mb-3">
              Contact Us
            </h3>
            <p>
              <strong>Contact Information:</strong> If you have any queries relating to the processing/usage of information provided by you or inoxsecure's Privacy Policy, you may email the Data Protection Officer (DPO) at <a href="mailto:privacy@inoxsecure.com">privacy@inoxsecure.com</a>.
            </p>


          </section>


        </div>
      </div>

    </div>
  );
}
