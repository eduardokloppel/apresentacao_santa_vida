// Elementos do DOM
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const slideCounter = document.getElementById('slide-counter');
const btnContact = document.querySelector('.btn-contact');
const animatedBtn = document.querySelector('.animated-btn');
const nodeIcons = document.querySelectorAll('.node-icon');

// Variáveis de controle
let currentSlide = 0;
const totalSlides = 5;

// Modal functionality for graphs
const modal = document.getElementById('graph-modal');
const modalImg = document.getElementById('modal-image');
const closeModal = document.querySelector('.close-modal');
const chartWrappers = document.querySelectorAll('.chart-wrapper');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    updateSlideCounter();
    initAnimations();
    
    // Adicionar listeners de eventos para navegação com teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        }
    });
    
    // Listeners para botões de navegação
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Animated button effect
    if (animatedBtn) {
        animatedBtn.addEventListener('click', function() {
            nextSlide();
        });
    }
    
    // Permitir também clicar no slide para avançar
    slides.forEach(slide => {
        slide.addEventListener('click', function(e) {
            // Apenas avança se o clique não for em um link ou botão
            if (!e.target.closest('a') && !e.target.closest('button')) {
                nextSlide();
            }
        });
    });
    
    // Hover effects for benefit items
    const benefitItems = document.querySelectorAll('.benefit-item');
    benefitItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.add('animate__animated', 'animate__heartBeat');
                
                setTimeout(() => {
                    icon.classList.remove('animate__animated', 'animate__heartBeat');
                }, 1000);
            }
        });
    });
    
    // Exibir o primeiro slide
    showSlide(currentSlide);

    // Add click event to all chart wrappers
    chartWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', function() {
            const img = wrapper.querySelector('img');
            if (img) {
                modal.classList.add('show');
                modalImg.src = img.src;
                modalImg.alt = img.alt;
                document.body.style.overflow = 'hidden';
            }
        });
    });
});

// Inicializa as animações da página
function initAnimations() {
    // Animated typing effect for tagline
    const tagline = document.querySelector('.intro-tagline');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                tagline.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        };
        
        // Start typing animation after a small delay
        setTimeout(typeWriter, 500);
    }
    
    // Animate node connections
    animateNodes();
}

// Animate the AI nodes with random movements
function animateNodes() {
    if (nodeIcons.length === 0) return;
    
    nodeIcons.forEach((node, index) => {
        // Create random animation
        const randomX = Math.random() * 10 - 5; // -5 to 5
        const randomY = Math.random() * 10 - 5; // -5 to 5
        const randomDuration = 2 + Math.random() * 2; // 2-4 seconds
        const randomDelay = index * 0.3; // stagger effect
        
        node.style.transition = `transform ${randomDuration}s ease-in-out ${randomDelay}s`;
        node.style.transform = `translate(${randomX}px, ${randomY}px)`;
        
        // Reset and repeat animation periodically
        setTimeout(() => {
            node.style.transform = 'translate(0, 0)';
            
            // Continue animation loop
            setTimeout(() => {
                animateNodes();
            }, randomDuration * 1000);
        }, (randomDuration + randomDelay) * 1000);
    });
}

// Mostrar slide específico com animação
function showSlide(index) {
    // Remover classe active de todos os slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Adicionar classe active ao slide atual
    slides[index].classList.add('active');
    
    // Animar elementos do slide atual
    animateSlideContent(slides[index]);
    
    // Atualizar contador
    updateSlideCounter();
    
    // Controlar visibilidade dos botões de navegação
    prevBtn.style.opacity = index === 0 ? '0.5' : '1';
    nextBtn.style.opacity = index === totalSlides - 1 ? '0.5' : '1';
}

// Animar elementos do slide ao mostrar
function animateSlideContent(slide) {
    // Find chart elements to animate
    const charts = slide.querySelectorAll('.chart');
    charts.forEach((chart, index) => {
        chart.style.opacity = '0';
        chart.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            chart.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            chart.style.opacity = '1';
            chart.style.transform = 'translateY(0)';
        }, 100 + (index * 150));
    });
    
    // Animate stat values with counting effect
    const statValues = slide.querySelectorAll('.big-number');
    statValues.forEach(stat => {
        // Extrair o valor numérico (ignora o % e outros caracteres)
        const content = stat.textContent;
        let value;
        
        // Checar se é um intervalo como "6-8"
        if (content.includes('-')) {
            return; // Não animar intervalos
        }
        
        // Extrair o valor numérico, ignorando quaisquer caracteres não numéricos
        value = parseFloat(content.replace(/[^\d.,]/g, '').replace(',', '.'));
        
        if (!isNaN(value)) {
            let startValue = 0;
            const duration = 1500;
            const increment = value / (duration / 16);
            const originalText = stat.textContent; // Guardar o texto original com % ou outros sufixos
            const suffix = originalText.replace(/[\d.,]/g, ''); // Extrair o sufixo (%, etc)
            
            stat.textContent = '0' + suffix;
            
            const counter = setInterval(() => {
                startValue += increment;
                if (startValue >= value) {
                    stat.textContent = originalText; // Restaurar texto original
                    clearInterval(counter);
                } else {
                    // Formatar o número com a mesma quantidade de casas decimais do original
                    const decimalPlaces = (originalText.match(/,\d+/) || [''])[0].length - 1;
                    const formattedValue = decimalPlaces > 0
                        ? startValue.toFixed(decimalPlaces).replace('.', ',')
                        : Math.floor(startValue);
                    stat.textContent = formattedValue + suffix;
                }
            }, 16);
        }
    });
    
    // Animate conclusion items
    const conclusions = slide.querySelectorAll('.conclusion-item');
    conclusions.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 300 + (index * 200));
    });
    
    // Animate benefit items
    const benefits = slide.querySelectorAll('.benefit-item');
    benefits.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        }, 200 + (index * 150));
    });
}

// Ir para o próximo slide
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        showSlide(currentSlide);
    }
}

// Ir para o slide anterior
function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
    }
}

// Atualizar contador de slides
function updateSlideCounter() {
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
}

// Adicionar funcionalidade para gerar PDF
function generatePDF() {
    window.print();
}

// Funcionalidade para modo de apresentação
let isFullscreen = false;

function toggleFullscreen() {
    if (!isFullscreen) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    isFullscreen = !isFullscreen;
}

// Adicionar swipe para dispositivos móveis
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const threshold = 50; // Mínimo de distância para considerar um swipe
    
    if (touchEndX < touchStartX - threshold) {
        // Swipe para a esquerda (próximo slide)
        nextSlide();
    } else if (touchEndX > touchStartX + threshold) {
        // Swipe para a direita (slide anterior)
        prevSlide();
    }
}

// Close modal when clicking the close button
closeModal.addEventListener('click', function() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside the image
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}); 