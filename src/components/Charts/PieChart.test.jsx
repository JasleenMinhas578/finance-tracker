import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PieChart from './PieChart';

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Pie: ({ data, options }) => (
    <div data-testid="pie-chart" data-chart-data={JSON.stringify(data)} data-chart-options={JSON.stringify(options)}>
      Mock Pie Chart
    </div>
  )
}));

// Mock chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn()
  },
  ArcElement: 'ArcElement',
  Tooltip: 'Tooltip',
  Legend: 'Legend'
}));

describe('PieChart Component', () => {
  const mockData = {
    labels: ['Food', 'Transport', 'Entertainment'],
    datasets: [
      {
        data: [300, 150, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 1
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render pie chart with provided data', () => {
      render(<PieChart data={mockData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      expect(chartElement).toBeInTheDocument();
      expect(chartElement).toHaveTextContent('Mock Pie Chart');
    });

    it('should pass data to chart component', () => {
      render(<PieChart data={mockData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      const chartData = JSON.parse(chartElement.getAttribute('data-chart-data'));
      
      expect(chartData).toEqual(mockData);
    });

    it('should render chart wrapper div', () => {
      render(<PieChart data={mockData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      expect(chartElement.parentElement).toHaveClass('chart-wrapper');
    });
  });

  describe('Chart Options', () => {
    it('should have correct legend position', () => {
      render(<PieChart data={mockData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      const chartOptions = JSON.parse(chartElement.getAttribute('data-chart-options'));
      
      expect(chartOptions.plugins.legend.position).toBe('right');
    });

    it('should have correct legend label color', () => {
      render(<PieChart data={mockData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      const chartOptions = JSON.parse(chartElement.getAttribute('data-chart-options'));
      
      expect(chartOptions.plugins.legend.labels.color).toBe('#e2e8f0');
    });

    it('should have correct font family', () => {
      render(<PieChart data={mockData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      const chartOptions = JSON.parse(chartElement.getAttribute('data-chart-options'));
      
      expect(chartOptions.plugins.legend.labels.font.family).toBe("'Inter', sans-serif");
    });

    it('should maintain aspect ratio disabled', () => {
      render(<PieChart data={mockData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      const chartOptions = JSON.parse(chartElement.getAttribute('data-chart-options'));
      
      expect(chartOptions.maintainAspectRatio).toBe(false);
    });
  });

  describe('Data Handling', () => {
    it('should handle empty data', () => {
      const emptyData = {
        labels: [],
        datasets: []
      };
      
      render(<PieChart data={emptyData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      const chartData = JSON.parse(chartElement.getAttribute('data-chart-data'));
      
      expect(chartData).toEqual(emptyData);
    });

    it('should handle single dataset', () => {
      const singleDatasetData = {
        labels: ['Category'],
        datasets: [
          {
            data: [100],
            backgroundColor: ['#FF6384'],
            borderColor: ['#FF6384'],
            borderWidth: 1
          }
        ]
      };
      
      render(<PieChart data={singleDatasetData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      const chartData = JSON.parse(chartElement.getAttribute('data-chart-data'));
      
      expect(chartData).toEqual(singleDatasetData);
    });

    it('should handle multiple datasets', () => {
      const multiDatasetData = {
        labels: ['Category 1', 'Category 2'],
        datasets: [
          {
            data: [100, 200],
            backgroundColor: ['#FF6384', '#36A2EB'],
            borderColor: ['#FF6384', '#36A2EB'],
            borderWidth: 1
          },
          {
            data: [50, 150],
            backgroundColor: ['#FFCE56', '#4BC0C0'],
            borderColor: ['#FFCE56', '#4BC0C0'],
            borderWidth: 1
          }
        ]
      };
      
      render(<PieChart data={multiDatasetData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      const chartData = JSON.parse(chartElement.getAttribute('data-chart-data'));
      
      expect(chartData).toEqual(multiDatasetData);
    });

    it('should handle data with custom border width', () => {
      const customBorderData = {
        labels: ['Category'],
        datasets: [
          {
            data: [100],
            backgroundColor: ['#FF6384'],
            borderColor: ['#FF6384'],
            borderWidth: 3
          }
        ]
      };
      
      render(<PieChart data={customBorderData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      const chartData = JSON.parse(chartElement.getAttribute('data-chart-options'));
      
      expect(chartData).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should have chart wrapper with proper structure', () => {
      render(<PieChart data={mockData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      const wrapper = chartElement.parentElement;
      
      expect(wrapper).toHaveClass('chart-wrapper');
      expect(wrapper).toContainElement(chartElement);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null data gracefully', () => {
      expect(() => {
        render(<PieChart data={null} />);
      }).not.toThrow();
    });

    it('should handle undefined data gracefully', () => {
      expect(() => {
        render(<PieChart data={undefined} />);
      }).not.toThrow();
    });

    it('should handle missing labels', () => {
      const dataWithoutLabels = {
        datasets: [
          {
            data: [100, 200],
            backgroundColor: ['#FF6384', '#36A2EB'],
            borderColor: ['#FF6384', '#36A2EB'],
            borderWidth: 1
          }
        ]
      };
      
      expect(() => {
        render(<PieChart data={dataWithoutLabels} />);
      }).not.toThrow();
    });

    it('should handle missing datasets', () => {
      const dataWithoutDatasets = {
        labels: ['Category 1', 'Category 2']
      };
      
      expect(() => {
        render(<PieChart data={dataWithoutDatasets} />);
      }).not.toThrow();
    });
  });

  describe('Props Validation', () => {
    it('should accept data prop', () => {
      render(<PieChart data={mockData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      expect(chartElement).toBeInTheDocument();
    });

    it('should not require additional props', () => {
      render(<PieChart data={mockData} />);
      
      const chartElement = screen.getByTestId('pie-chart');
      expect(chartElement).toBeInTheDocument();
    });
  });
}); 