// "use client"

// import { useEffect, useRef } from "react"

// export function MusicBackgroundAnimation() {
//   const canvasRef = useRef<HTMLCanvasElement>(null)

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     // Set canvas to full screen
//     const resizeCanvas = () => {
//       canvas.width = window.innerWidth
//       canvas.height = window.innerHeight
//     }

//     resizeCanvas()
//     window.addEventListener("resize", resizeCanvas)

//     // Musical notes and waves
//     class MusicParticle {
//       x: number
//       y: number
//       size: number
//       speedX: number
//       speedY: number
//       color: string
//       opacity: number
//       type: "note" | "wave"

//       constructor(canvasWidth: number, canvasHeight: number) {
//         this.x = Math.random() * canvasWidth
//         this.y = Math.random() * canvasHeight
//         this.size = Math.random() * 3 + 1
//         this.speedX = Math.random() * 1 - 0.5
//         this.speedY = Math.random() * 0.5 - 0.7

//         // Rainbow colors
//         const hue = Math.random() * 360
//         this.color = `hsl(${hue}, 100%, 70%)`
//         this.opacity = Math.random() * 0.5 + 0.2

//         // 70% chance of being a wave, 30% chance of being a note
//         this.type = Math.random() > 0.7 ? "note" : "wave"
//       }

//       update(canvasHeight: number, canvasWidth: number) {
//         this.x += this.speedX
//         this.y += this.speedY

//         // Reset if out of bounds
//         if (this.y < 0) {
//           this.y = canvasHeight
//           this.x = Math.random() * canvasWidth // השתמש ברוחב שנשלח כפרמטר
//         }

//         // Fade out as they rise
//         if (this.opacity > 0.1) {
//           this.opacity -= 0.001
//         }
//       }

//       draw(ctx: CanvasRenderingContext2D) {
//         if (!ctx) return

//         ctx.globalAlpha = this.opacity
//         ctx.fillStyle = this.color

//         if (this.type === "note") {
//           // Draw a simple music note shape
//           ctx.beginPath()
//           ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
//           ctx.fill()

//           // Stem
//           ctx.beginPath()
//           ctx.moveTo(this.x + this.size, this.y)
//           ctx.lineTo(this.x + this.size, this.y - this.size * 5)
//           ctx.strokeStyle = this.color
//           ctx.lineWidth = this.size / 2
//           ctx.stroke()
//         } else {
//           // Draw a wave
//           ctx.beginPath()

//           const waveWidth = this.size * 20
//           const waveHeight = this.size * 2

//           ctx.moveTo(this.x, this.y)

//           for (let i = 0; i < 3; i++) {
//             ctx.quadraticCurveTo(
//               this.x + waveWidth / 4 + (waveWidth / 2) * i,
//               this.y - waveHeight + (i % 2 === 0 ? waveHeight * 2 : 0),
//               this.x + waveWidth / 2 + (waveWidth / 2) * i,
//               this.y,
//             )
//           }

//           ctx.strokeStyle = this.color
//           ctx.lineWidth = this.size / 2
//           ctx.stroke()
//         }

//         ctx.globalAlpha = 1
//       }
//     }

//     // Create particles
//     const particles: MusicParticle[] = []
//     const particleCount = Math.min(50, Math.floor(window.innerWidth / 30))

//     for (let i = 0; i < particleCount; i++) {
//       particles.push(new MusicParticle(canvas.width, canvas.height))
//     }

//     // Animation loop
//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height)

//       // Draw a subtle gradient background
//       const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
//       gradient.addColorStop(0, "rgba(20, 10, 30, 0.2)")
//       gradient.addColorStop(1, "rgba(5, 5, 10, 0.2)")
//       ctx.fillStyle = gradient
//       ctx.fillRect(0, 0, canvas.width, canvas.height)

//       // Update and draw particles
//       particles.forEach((particle) => {
//         particle.update(canvas.height, canvas.width) // מעביר את רוחב הקנבס
//         particle.draw(ctx)
//       })

//       // Add new particles occasionally
//       if (Math.random() > 0.95) {
//         particles.push(new MusicParticle(canvas.width, canvas.height))

//         // Remove a particle if we have too many
//         if (particles.length > particleCount * 1.5) {
//           particles.shift()
//         }
//       }

//       requestAnimationFrame(animate)
//     }

//     animate()

//     return () => {
//       window.removeEventListener("resize", resizeCanvas)
//     }
//   }, [])

//   return (
//     <canvas
//       ref={canvasRef}
//       className="absolute inset-0 z-0"
//       style={{
//         background: "black",
//         pointerEvents: "none",
//       }}
//     />
//   )
// }
