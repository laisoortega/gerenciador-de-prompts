# Blaze/PromptMaster - Guia de Desenvolvimento

## Design System

### Fontes
- **Títulos (h1-h6)**: `'Cabinet Grotesk'` - fonte premium, peso 700, `letter-spacing: -0.02em`
- **Corpo/UI**: `'Inter'` - fonte limpa e legível
- **Código**: `'JetBrains Mono'`

### Cores
Usar variáveis CSS ao invés de valores hardcoded:
- `text-text-primary` - texto principal
- `text-text-secondary` - texto secundário  
- `text-text-muted` - texto desabilitado/sutil
- `bg-bg-base` - fundo da página
- `bg-bg-surface` - fundo de cards
- `bg-bg-elevated` - fundo de inputs/elementos elevados
- `border-border-subtle` - bordas sutis
- `border-border-default` - bordas padrão

### Componentes Padronizados

**SEMPRE usar componentes existentes:**

1. **Modal** (`src/components/ui/Modal.tsx`)
   ```tsx
   <Modal size="md" onClose={handleClose}>
     <Modal.Header>
       <h2 className="text-xl font-bold text-text-primary">Título</h2>
       <button onClick={handleClose}>
         <X className="w-5 h-5" />
       </button>
     </Modal.Header>
     <Modal.Body className="space-y-4">
       {/* Conteúdo */}
     </Modal.Body>
     <Modal.Footer>
       <div className="flex justify-end gap-3 w-full">
         <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
         <Button onClick={handleSave}>Salvar</Button>
       </div>
     </Modal.Footer>
   </Modal>
   ```

2. **Button** (`src/components/ui/Button.tsx`)
   - Variantes: `primary`, `secondary`, `ghost`, `danger`
   - Tamanhos: `sm`, `md`, `lg`

3. **Input** (`src/components/ui/Input.tsx`)
   - Props: `label`, `error`, `placeholder`

4. **Card** (`src/components/ui/Card.tsx`)
   - Subcomponentes: `Card.Header`, `Card.Body`, `Card.Footer`

### Regras de Layout

1. **Espaçamentos**: Usar múltiplos de 4px (0.25rem)
   - `gap-2` (8px), `gap-3` (12px), `gap-4` (16px), `gap-6` (24px)
   - `p-4` para padding de cards, `px-6 py-4` para modais

2. **Border Radius**:
   - Botões e inputs: `rounded-xl` (1rem)
   - Cards: `rounded-2xl` (1.5rem)
   - Badges/Pills: `rounded-full`

3. **Animações**:
   - Usar classes: `animate-fadeIn`, `animate-slideUp`, `animate-scaleIn`
   - Transições: `transition-colors`, `transition-all duration-200`

### Checklist para Novos Componentes

- [ ] Usar fontes do Design System (não hardcoded)
- [ ] Usar variáveis de cor CSS (não hex/rgb)
- [ ] Usar componentes UI existentes (Button, Modal, Input, Card)
- [ ] Seguir padrão de espaçamento (múltiplos de 4px)
- [ ] Incluir estados: loading, error, empty
- [ ] Adicionar animações de entrada (fadeIn/slideUp)
- [ ] Testar em dark mode E light mode
