import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedTool, setSelectedTool] = useState('select');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    { id: 'select', icon: 'MousePointer', label: 'Выбор' },
    { id: 'router', icon: 'Router', label: 'Роутер' },
    { id: 'server', icon: 'Server', label: 'Сервер' },
    { id: 'laptop', icon: 'Laptop', label: 'Компьютер' },
    { id: 'smartphone', icon: 'Smartphone', label: 'Устройство' },
    { id: 'wifi', icon: 'Wifi', label: 'WiFi' },
    { id: 'connection', icon: 'Minus', label: 'Соединение' },
    { id: 'text', icon: 'Type', label: 'Текст' }
  ];

  const handleExport = () => {
    const exportData = {
      version: '1.0',
      type: 'drawio',
      pages: [
        {
          id: 'page1',
          name: 'Network Diagram',
          elements: []
        }
      ]
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'network-diagram.drawio';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          console.log('Imported data:', data);
        } catch (error) {
          console.error('Error parsing file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Заголовок */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Редактор сетевых диаграмм</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Icon name="Upload" size={16} className="mr-2" />
                Импорт
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Icon name="Download" size={16} className="mr-2" />
                Экспорт
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить
            </Button>
            <Button size="sm">
              <Icon name="Share" size={16} className="mr-2" />
              Поделиться
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Панель инструментов */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="sm"
              className="w-12 h-12 p-0 relative group"
              onClick={() => setSelectedTool(tool.id)}
            >
              <Icon name={tool.icon} size={20} />
              <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {tool.label}
              </div>
            </Button>
          ))}
          
          <Separator className="w-8 my-2" />
          
          <Button variant="ghost" size="sm" className="w-12 h-12 p-0">
            <Icon name="ZoomIn" size={20} />
          </Button>
          <Button variant="ghost" size="sm" className="w-12 h-12 p-0">
            <Icon name="ZoomOut" size={20} />
          </Button>
        </div>

        {/* Основная рабочая область */}
        <div className="flex-1 flex flex-col">
          {/* Панель свойств */}
          <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Palette" size={16} className="text-gray-500" />
              <div className="flex space-x-1">
                <div className="w-6 h-6 bg-blue-500 rounded border-2 border-gray-300 cursor-pointer"></div>
                <div className="w-6 h-6 bg-orange-500 rounded border cursor-pointer"></div>
                <div className="w-6 h-6 bg-purple-500 rounded border cursor-pointer"></div>
                <div className="w-6 h-6 bg-green-500 rounded border cursor-pointer"></div>
              </div>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Толщина:</span>
              <div className="flex space-x-1">
                <div className="w-4 h-1 bg-gray-400 cursor-pointer"></div>
                <div className="w-4 h-0.5 bg-gray-400 cursor-pointer"></div>
                <div className="w-4 h-2 bg-blue-500 cursor-pointer"></div>
              </div>
            </div>
          </div>

          {/* Canvas область */}
          <div className="flex-1 relative overflow-hidden bg-gray-50">
            <div className="absolute inset-0 bg-white m-8 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Сетка */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
              
              {/* Рабочая область canvas */}
              <div className="relative w-full h-full">
                <canvas 
                  className="absolute inset-0 cursor-crosshair"
                  width="100%"
                  height="100%"
                />
                
                {/* Демонстрационные элементы */}
                <div className="absolute top-20 left-20">
                  <Card className="p-4 bg-blue-50 border-blue-200 w-24 h-16 flex items-center justify-center cursor-move hover:shadow-md transition-shadow">
                    <Icon name="Router" size={24} className="text-blue-600" />
                  </Card>
                </div>
                
                <div className="absolute top-20 right-20">
                  <Card className="p-4 bg-orange-50 border-orange-200 w-24 h-16 flex items-center justify-center cursor-move hover:shadow-md transition-shadow">
                    <Icon name="Server" size={24} className="text-orange-600" />
                  </Card>
                </div>
                
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                  <Card className="p-4 bg-purple-50 border-purple-200 w-24 h-16 flex items-center justify-center cursor-move hover:shadow-md transition-shadow">
                    <Icon name="Laptop" size={24} className="text-purple-600" />
                  </Card>
                </div>

                {/* Демонстрационные соединения */}
                <svg className="absolute inset-0 pointer-events-none">
                  <line 
                    x1="132" y1="88" 
                    x2="calc(100% - 132px)" y2="88"
                    stroke="#2196F3" 
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <line 
                    x1="50%" y1="88" 
                    x2="50%" y2="calc(100% - 88px)"
                    stroke="#9C27B0" 
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Панель свойств справа */}
        <div className="w-64 bg-white border-l border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-4">Свойства элемента</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название
              </label>
              <input 
                type="text" 
                placeholder="Название элемента"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP адрес
              </label>
              <input 
                type="text" 
                placeholder="192.168.1.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип устройства
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Роутер</option>
                <option>Сервер</option>
                <option>Компьютер</option>
                <option>Мобильное устройство</option>
              </select>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Стиль</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Цвет фона</label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-blue-100 border-2 border-blue-300 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-orange-100 border border-gray-300 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-purple-100 border border-gray-300 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-green-100 border border-gray-300 rounded cursor-pointer"></div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Цвет границы</label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-blue-500 border border-gray-300 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-orange-500 border border-gray-300 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-purple-500 border border-gray-300 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-green-500 border border-gray-300 rounded cursor-pointer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Скрытый input для загрузки файлов */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".drawio,.xml,.json"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default Index;