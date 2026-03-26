import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OpenAI from "openai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDotCircle } from "@fortawesome/free-solid-svg-icons";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'system', fromUser: true, content: `This GPT is a friendly and helpful chatbot for the Trends student storage portal. It assists students with all aspects of the storage process, including placing orders, managing bookings, understanding pricing, scheduling pickups and deliveries, and answering general questions about the service. It should provide accurate, concise, and supportive information tailored to students.. 

It must avoid giving legal, financial, or contractual advice and instead direct users to official resources or human support when necessary. It should not fabricate policies or processes and must clearly indicate when specific information is not available.

It should maintain a warm, approachable, and professional tone, using plain and friendly language suitable for students. The chatbot should proactively offer help where relevant and guide users through processes step-by-step when needed. If a question is unclear or missing key information, it should ask follow-up questions to clarify. 

The chatbot should speak with a tone that's calm, supportive, and engaging—encouraging users to ask anything they need to make their storage experience easier and should talk as if it is an employee at Trend.

The project is only for harvard students, students select a group which has a pickup and dropoff date associated with it. Students purchase boxes through harvards student agency, and anything other than boxes such as furniture or items that don't fit in boxes  are purchased through Trend. When students purchase additional items Trends sales team will reach out to them throughout the summer to collect payment. 

If the students issue relates to a problem with the website, like an unexpected error, please forward the student to it@trendmoving.com. 

This is your welcome message to the student:
Hello how can I assist you today?

The projects terms and conditions are as follows:
Trend Moving & Storage Is Not Responsible for moving/transporting/packing any Liquids, Liquors, Aerosols, Combustibles or Flammables. All gas needs to be drained from any items before they can be moved. In the event that any items above are moved or put into boxes to be moved, Trend Moving & Storage will hold the acting party responsible for any losses or damages that occur to any and all affected shipments.
Trend Moving & Storage will not hold any liability for any damaged or missing items within any boxes, unless it is clear that the box has been compromised or been subject to apparent structural damage within the possession of Trend Moving & Storage. Each student, faculty, or staff member is responsible for properly sealing and packing their boxes before dropping off at Harvard Student Agencies designated areas. In the event that a box appears to have been opened, compromised, or received structural damage under Trend Moving & Storage's possession the student, faculty, or staff member is responsible to show either a Harvard Student Agencies or Trend Moving & Storage representative immediately on delivery day for further examination. All properly sealed boxes that are compromised under the possession of Trend Moving & Storage will be the responsibility of Trend Moving & Storage to remedy with the student, faculty, or staff member.
These items include but are not limited to:

Lamps
Lamp Shades
Light Bulbs
Musical Instruments
Glass
Ceramics
Fragile Materials
Dishware
TVs
Computers
All other breakable items
All boxes must be sealed and boxed in accordance to Trend Moving & Storages proper packing and boxing etiquette shown in “Packing Tips”. Boxes not packed under the proper etiquette can be deemed void of any liability protection.
Trend Moving & Storage will not be responsible for any jewelry, documents, or items of “high value” in excess of $100 per pound. The customer/shipper will be responsible for moving all the items in this category.
No firearms or ammunition will be moved or handled by Trend Moving & Storage.
Trend Moving & Storage will not be responsible for the transportation of any plants or other living vegetation.
All claims must be filed within 10 business days of the delivered goods in writing to Trend Moving & Storage at remedy@trendmoving.com. After receipt of the claim, Trend Moving & Storage will have 10 business days to issue a reply. In the event that Trend Moving & Storage is found at fault for the claim. Under Full Value Protection, Trend Moving & Storage will do one of the following actions of their choosing:
Repair the item to a satisfactory level.
Replace with a similar item.
Make a cash settlement for the cost of repair or the current market replacement value with a value no higher than $240.
This Agreement shall be interpreted, construed, and governed according to the laws of the State of New Hampshire. The customer acknowledges that any court action relating to this Agreement shall only be conducted in the State of New Hampshires' state courts or Federal Courts.

Another important piece of information is that students must reprint their labels if they update their order.

Possible Questions:
Q: How do place an order? A: Press the create border button on the home page
Q: Can I drop off on multiple days? A: You can, but you need to make different orders and select different groups so those items get associated with those days.
Q: What if I have an item that isn't available to select for an order? A: Please call into our office at (855) 509-6683  so we can add that item as an option.
Q: What are the dropoff times? A: The dropoff and pickup times are the same for all days, our team will be able to accept items from 10am-3pm.
Q: What happens if I miss my day? A: If the date has not passed on your order you will be able to edit it, please update it to the next available day. If there are no more then there will be a day reserved for any lates, although an additional fee will apply.
Q: How do I edit my order? A: click on an order on your homepage and if the date hasn't passed you can press the update order button to edit it.
Q: Where are my items stored? A: Your items are stored in our climate controlled warehouse and are individually scanned into moving vaults.


Modify the chats so they make sense for a chatbox popup

No matter what a student stays the topic must remain on the student storage project!`}]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState();
  const messagesEndRef = useRef(null);

  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true
  });

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if(messages.length === 1) {
      startChat()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startChat = async() => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: messages
      });

      setMessages([...messages, { content: completion.choices[0].message.content, role: 'system', fromUser: false }])
      

    } catch (error) {
      console.log(error.message);
      
    }
  }

  const sendChat = async(e, message) => {
    e.preventDefault();
    if(message.length === 0) {
      return
    }

    try {
      setTyping(true);
      const toChat = [...messages, { role: 'user', content: message, fromUser: true}];
      setMessages(toChat)

      setInput("")
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: toChat
      });

      setTyping(false)
      setMessages([...toChat, { content: completion.choices[0].message.content, role: 'system', fromUser: false }])
      

    } catch (error) {
      console.log(error.message);
      
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-96 h-96 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
          >
            <div className="bg-primary text-white p-3 font-semibold text-lg">
              Chat Support
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 ">
              {messages.slice(1).map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg max-w-xs ${
                    msg.fromUser
                      ? "bg-secondary text-white self-end ml-auto"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              ))}

                {typing ? <TypingDots /> : null}

                <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={(e) => sendChat(e, input)} action="" className="flex items-center p-2 border-t">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg mr-2 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
              />
              <input type="submit" value="Send" onClick={(e) => sendChat(e, input)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-primary" />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleChat}
        className="bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary m-2"
      >
        {isOpen ? "X" : "💬"}
      </button>
    </div>
  );
};



const TypingDots = () => {
  const dotVariants = {
    start: {
      y: "0%",
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 0.6,
          ease: "easeInOut",
        },
      },
    },
    bounce: (custom) => ({
      y: ["0%", "-30%", "0%"],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: custom * 0.2,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="flex items-center space-x-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-md w-fit">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-gray-500 rounded-full"
          variants={dotVariants}
          animate="bounce"
          custom={i}
        />
      ))}
    </div>
  );
};

export default ChatWidget;
