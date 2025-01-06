import { Button, Popover } from 'antd';
import { IconClose } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';
import { useReactFlow } from '@xyflow/react';
import { getContextItemIcon } from './utils/icon';
import { IContextItem } from '@refly-packages/ai-workspace-common/stores/context-panel';
import cn from 'classnames';
import { ContextPreview } from './context-preview';
import { useCallback, useMemo } from 'react';
import { Message } from '@arco-design/web-react';
import { useCanvasData } from '@refly-packages/ai-workspace-common/hooks/canvas/use-canvas-data';
import { useNodeSelection } from '@refly-packages/ai-workspace-common/hooks/canvas/use-node-selection';
import { useNodePosition } from '@refly-packages/ai-workspace-common/hooks/canvas/use-node-position';
import { CanvasNode } from '@refly-packages/ai-workspace-common/components/canvas/nodes';

export const ContextItem = ({
  item,
  isLimit,
  isActive,
  disabled,
  onRemove,
  canNotRemove,
}: {
  canNotRemove?: boolean;
  item: IContextItem;
  isActive: boolean;
  isLimit?: boolean;
  disabled?: boolean;
  onRemove?: (item: IContextItem) => void;
}) => {
  const { t } = useTranslation();
  const { title, entityId, type, selection, metadata, isCurrentContext } = item ?? {};
  const icon = getContextItemIcon(item.type, null, { withHistory: metadata?.withHistory });
  const { setSelectedNode } = useNodeSelection();
  const { nodes } = useCanvasData();
  const { getNodes } = useReactFlow();
  const { setNodeCenter } = useNodePosition();

  const handleItemClick = useCallback(async () => {
    const node = getNodes().find((node) => node.data?.entityId === entityId);

    if (!node) {
      return;
    }

    setNodeCenter(node.id);

    if (selection) {
      const sourceEntityId = selection.sourceEntityId;
      const sourceEntityType = selection.sourceEntityType;

      if (!sourceEntityId || !sourceEntityType) {
        console.warn('Missing source entity information for selection node');
        return;
      }

      const sourceNode = nodes.find((node) => node.data?.entityId === sourceEntityId && node.type === sourceEntityType);

      if (!sourceNode) {
        Message.warning({
          content: t('canvas.contextManager.nodeNotFound'),
        });
        return;
      }

      setSelectedNode(sourceNode);
    } else {
      setSelectedNode(node as CanvasNode<any>);
    }
  }, [entityId, selection, setSelectedNode, t]);

  const content = <ContextPreview item={item} />;

  const isSelection = metadata?.sourceType?.toLowerCase()?.includes('selection');
  const sourceType = isSelection ? 'selection' : type;

  const contextTypeDesc = useMemo(() => {
    if (type !== 'skillResponse') {
      return (isCurrentContext ? t('copilot.contextItem.current') : '') + t(`copilot.contextItem.${sourceType}`);
    }
    if (metadata?.withHistory) {
      return t('copilot.contextItem.threadHistory');
    }
    return t('copilot.contextItem.skillResponse');
  }, [type, metadata?.withHistory, isCurrentContext, t]);

  return (
    <Popover
      arrow={false}
      content={content}
      trigger="hover"
      mouseEnterDelay={0.5}
      mouseLeaveDelay={0.1}
      overlayInnerStyle={{ padding: 0 }}
      overlayClassName="context-preview-popover rounded-lg"
    >
      <Button
        className={cn(
          'max-w-40 h-6 px-1 flex items-center border border-gray-200 rounded transition-all duration-300',
          {
            'border-green-500': isActive,
            'border-red-300 bg-red-50 text-red-500': isLimit,
            'bg-gray-100 border-gray-200': disabled,
            'border-dashed': item?.isPreview,
          },
        )}
        onClick={() => handleItemClick()}
      >
        <div className="h-[18px] flex items-center w-full text-xs">
          <span className="flex items-center flex-shrink-0 mr-1">{icon}</span>
          <span
            className={cn(
              'flex-1 whitespace-nowrap overflow-hidden text-ellipsis min-w-0 mr-1 text-gray-600 hover:text-green-600',
              {
                'text-gray-300': disabled,
                'text-red-500': isLimit,
              },
            )}
          >
            {title}
          </span>
          {/* <span className="item-type text-gray-500 mr-1">{contextTypeDesc}</span> */}
          {!canNotRemove && (
            <IconClose
              className={cn('flex-shrink-0 text-xs cursor-pointer', {
                'text-gray-300': disabled,
                'text-red-500': isLimit,
              })}
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(item);
              }}
            />
          )}
        </div>
      </Button>
    </Popover>
  );
};
