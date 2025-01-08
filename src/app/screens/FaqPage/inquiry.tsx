import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"

const Inquiry = (props: any) => {
  //Initializations
  const [loaded, setLoaded] = useState<boolean>(false)

  //React Hook
  useEffect(() => {
    setLoaded(true)
    return () => {
      setLoaded(false)
    }
  }, [])
  return (
    <Stack  >
      {
        props.inquiries.map((inquiryObj: { question: string, answer: string }, index: number) => {
          return (
            <Box
              className={loaded ? "question_item border-0 accordion w-100 mb-2 aos-animate" : "question_item border-0 accordion w-100 mb-2"}
              id={`accordion${index}`}
              key={index}
              data-aos="fade-up"
              data-aos-delay={100 * index}
            >
              <div
                className="accordion-item"
                style={{ backgroundColor: "#E7F2F8" }}
              >
                <h2 className="accordion-header">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                    {inquiryObj.question}
                  </button>
                </h2>
                <div id={`collapse${index}`} className="accordion-collapse collapse show" data-bs-parent={`#accordion${index}`}>
                  <div className="accordion-body">
                    <strong>{inquiryObj.answer}</strong>
                  </div>
                </div>
              </div>
            </Box>
          )
        })
      }
    </Stack>
  )
}

export default Inquiry;