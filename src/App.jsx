import { Route, Routes } from "react-router-dom"
import StaticQRCode from "./components/StaticQRCode"
import { FeedbackForm } from "./components/FeedbackForm"
import { FeedbackList } from "./components/FeedbackList"


const App = () => {
  return (
    <>
       <Routes>
       <Route path="/" element={<StaticQRCode />} />
       <Route path="/tech-guru-meetup-2025/feedback" element={<FeedbackForm />} />
       <Route path="/tech-guru-meetup-2025/all-feed-backs" element={<FeedbackList />} />
       </Routes>
    </>
  )
}

export default App